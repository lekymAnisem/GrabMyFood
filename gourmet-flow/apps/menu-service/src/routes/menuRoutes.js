import { Router } from 'express';
import * as menuController from '../controllers/menuController.js';

const router = Router();

router.get('/restaurants/:restaurantId/menu', menuController.getMenu);
router.get('/menu/categories', menuController.getCategories);
router.get('/menu/items/featured', menuController.getFeaturedItems);
router.get('/menu/items/:itemId', menuController.getItemById);

router.get('/health', (req, res) => {
  res.json({ service: 'menu-service', status: 'healthy', timestamp: new Date().toISOString() });
});
router.get('/ready', (req, res) => {
  res.json({ service: 'menu-service', status: 'ready', timestamp: new Date().toISOString() });
});

export default router;
