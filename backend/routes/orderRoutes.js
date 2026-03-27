import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.post('/', upload.single('paymentScreenshot'), createOrder);

export default router;
