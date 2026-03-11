import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            
            if (!token) {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
                return;
            }

            res.json({ success: true, token });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
