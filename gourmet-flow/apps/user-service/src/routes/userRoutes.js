import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/users/me', authenticate, userController.getProfile);
router.patch('/users/me', authenticate, userController.updateProfile);
router.get('/users/me/addresses', authenticate, userController.getAddresses);
router.post('/users/me/addresses', authenticate, userController.createAddress);
router.patch('/users/me/addresses/:addressId', authenticate, userController.updateAddress);
router.delete('/users/me/addresses/:addressId', authenticate, userController.deleteAddress);

router.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'healthy', timestamp: new Date().toISOString() });
});
router.get('/ready', (req, res) => {
  res.json({ service: 'user-service', status: 'ready', timestamp: new Date().toISOString() });
});

export default router;
