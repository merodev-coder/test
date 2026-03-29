import { Router } from 'express';
import { listGovernorates, listShippingMethods } from '../controllers/shippingController.js';

const router = Router();

router.get('/governorates', listGovernorates);
router.get('/methods', listShippingMethods);

export default router;
