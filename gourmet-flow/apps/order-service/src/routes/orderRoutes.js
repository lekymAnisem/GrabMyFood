import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import { validate, createOrderSchema, updateStatusSchema } from '../validators/orderValidators.js';

const router = Router();

router.get('/health', orderController.health);
router.get('/ready', orderController.ready);

router.use(auth);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:orderId', orderController.getOrderById);
router.patch('/:orderId/status', validate(updateStatusSchema), orderController.updateOrderStatus);
router.post('/:orderId/cancel', orderController.cancelOrder);

export default router;
