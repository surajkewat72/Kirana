import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { CartService } from '../services/CartService';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const cartService = new CartService();
const cartController = new CartController(cartService);

router.use(authenticate);

router.get('/', (req, res) => cartController.getCart(req, res));
router.post('/items', (req, res) => cartController.addItem(req, res));
router.delete('/items/:productId', (req, res) => cartController.removeItem(req, res));

export default router;
