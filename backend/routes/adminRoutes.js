import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { listOrders, updateOrderStatus } from '../controllers/orderController.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  listBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import {
  getMonthlyPerformance,
  getMonthlyAudit,
  getTopSellingItems,
  getOrdersForExport,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/orders', authMiddleware, listOrders);
router.patch('/orders/:id', authMiddleware, updateOrderStatus);

router.post('/inventory', authMiddleware, createProduct);
router.put('/inventory/:id', authMiddleware, updateProduct);
router.delete('/inventory/:id', authMiddleware, deleteProduct);

// Brand routes
router.get('/brands', authMiddleware, listBrands);
router.post('/brands', authMiddleware, createBrand);
router.patch('/brands/:id', authMiddleware, updateBrand);
router.delete('/brands/:id', authMiddleware, deleteBrand);

// Analytics routes
router.get('/monthly-performance', authMiddleware, getMonthlyPerformance);
router.get('/monthly-audit', authMiddleware, getMonthlyAudit);
router.get('/top-selling', authMiddleware, getTopSellingItems);
router.get('/orders-export', authMiddleware, getOrdersForExport);

export default router;
