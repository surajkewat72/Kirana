import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

router.get('/', (req, res) => productController.getProducts(req, res));
router.get('/:id', (req, res) => productController.getProduct(req, res));

export default router;
