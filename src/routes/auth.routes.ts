import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// Validation middleware
const validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    validate
], (req: any, res: any) => authController.register(req, res));

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], (req: any, res: any) => authController.login(req, res));

router.get('/me', authenticate, (req: any, res: any) => authController.getProfile(req, res));
router.patch('/me', authenticate, [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
], (req: any, res: any) => authController.updateProfile(req, res));

export default router;
