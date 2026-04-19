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
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Main API routes
app.use('/api/v1', routes);

// Health check
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
    console.error(`[Error] ${err.stack}`);
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
