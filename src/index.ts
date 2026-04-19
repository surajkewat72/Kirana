import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and utility middleware
app.use(helmet());

// Improved CORS with exact origin matching and Vercel wildcard support
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOWED_ORIGINS 
            ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, ''))
            : [];
        
        const isVercel = origin && (origin.endsWith('.vercel.app') || origin.includes('vercel.app'));
        const isAllowed = !origin || allowedOrigins.includes(origin.replace(/\/$/, '')) || allowedOrigins.length === 0 || isVercel;

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`[CORS Blocked] Origin: \${origin} is not in ALLOWED_ORIGINS (\${allowedOrigins.join(', ')}) and is not a Vercel domain.`);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(morgan('dev'));
app.use(express.json());

// Request logger for Render console
app.use((req, res, next) => {
    console.log(`[Request] \${new Date().toISOString()} - \${req.method} \${req.url} - Origin: \${req.get('origin') || 'None'}`);
    next();
});

// Main API routes
app.use('/api/v1', routes);

// Simple Server Health Check (No DB)
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Health check with DB status
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

// Serve frontend static files in production (only if dist exists)
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    
    // Check if directory exists to avoid errors on split deployment
    const fs = require('fs');
    if (fs.existsSync(frontendPath)) {
        app.use(express.static(frontendPath));
        
        // Handle SPA routing
        app.get('*', (req: Request, res: Response) => {
            if (!req.path.startsWith('/api/')) {
                res.sendFile(path.join(frontendPath, 'index.html'));
            }
        });
    }
}

// Centralized Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] \${req.method} \${req.url} - \${err.message}`);
    if (err.stack) console.error(err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`
    🚀 Kirana Backend is running!
    📡 Port: ${PORT}
    🌐 URL: http://localhost:${PORT}/api/v1
    `);
});

export default app;
