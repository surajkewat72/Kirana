import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const orderRepo = new PrismaOrderRepository();
const orderService = new OrderService(orderRepo);
const orderController = new OrderController(orderService);

router.use(authMiddleware);

router.post('/', (req, res) => orderController.placeOrder(req, res));
router.get('/', (req, res) => orderController.getUserOrders(req, res));

export default router;
