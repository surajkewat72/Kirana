import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const orderRepo = new PrismaOrderRepository();
const orderService = new OrderService(orderRepo);
const orderController = new OrderController(orderService);

router.use(authenticate);

router.post('/', (req, res) => orderController.placeOrder(req, res));
router.get('/', (req, res) => orderController.getUserOrders(req, res));

export default router;
