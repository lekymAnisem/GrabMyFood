import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh', authController.refresh);
router.get('/auth/verify', authenticate, authController.verify);
router.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'healthy', timestamp: new Date().toISOString() });
});
router.get('/ready', (req, res) => {
  res.json({ service: 'auth-service', status: 'ready', timestamp: new Date().toISOString() });
});

export default router;
