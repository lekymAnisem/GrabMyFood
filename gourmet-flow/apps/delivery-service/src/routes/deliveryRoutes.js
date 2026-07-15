import { Router } from 'express';
import * as deliveryController from '../controllers/deliveryController.js';

const router = Router();

router.post('/deliveries', deliveryController.createDelivery);
router.get('/deliveries/order/:orderId', deliveryController.getDeliveryByOrder);
router.patch('/deliveries/:deliveryId/status', deliveryController.updateDeliveryStatus);
router.patch('/deliveries/:deliveryId/location', deliveryController.updateDeliveryLocation);
router.get('/health', (req, res) => {
  res.json({ service: 'delivery-service', status: 'healthy', timestamp: new Date().toISOString() });
});
router.get('/ready', (req, res) => {
  res.json({ service: 'delivery-service', status: 'ready', timestamp: new Date().toISOString() });
});

export default router;
