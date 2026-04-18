import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AdminService } from '../services/AdminService';
import { ProductService } from '../services/ProductService';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const adminService = new AdminService();
const productService = new ProductService();
const adminController = new AdminController(adminService, productService);

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/stats', (req, res) => adminController.getStats(req, res));
router.get('/users', (req, res) => adminController.getUsers(req, res));
router.post('/products', (req, res) => adminController.addProduct(req, res));
router.patch('/products/:id/restock', (req, res) => adminController.restockProduct(req, res));

export default router;
