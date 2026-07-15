import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCreateReview } from '../validators/restaurantValidators.js';

const router = Router();

router.get('/restaurants', restaurantController.listRestaurants);
router.get('/restaurants/featured', restaurantController.getFeaturedRestaurants);
router.get('/restaurants/categories', restaurantController.getCategories);
router.get('/restaurants/:restaurantId', restaurantController.getRestaurantById);
router.get('/restaurants/:restaurantId/reviews', restaurantController.getReviews);
router.post('/restaurants/:restaurantId/reviews', authenticate, validateCreateReview, restaurantController.addReview);

router.get('/health', (req, res) => {
  res.json({ service: 'restaurant-service', status: 'healthy', timestamp: new Date().toISOString() });
});
router.get('/ready', (req, res) => {
  res.json({ service: 'restaurant-service', status: 'ready', timestamp: new Date().toISOString() });
});

export default router;
