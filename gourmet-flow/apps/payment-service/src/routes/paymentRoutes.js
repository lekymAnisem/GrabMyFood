import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = Router();

router.post('/payments/create-intent', paymentController.createIntent);
router.post('/payments/confirm', paymentController.confirmPayment);
router.post('/payments/:paymentId/refund', paymentController.refundPayment);
router.get('/payments/:paymentId', paymentController.getPayment);
router.get('/health', (req, res) => {
  res.json({ service: 'payment-service', status: 'healthy', timestamp: new Date().toISOString() });
});
router.get('/ready', (req, res) => {
  res.json({ service: 'payment-service', status: 'ready', timestamp: new Date().toISOString() });
});

export default router;
