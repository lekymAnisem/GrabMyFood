import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import auth from '../middleware/auth.js';
import { validate, addItemSchema, updateQuantitySchema, promoCodeSchema } from '../validators/cartValidators.js';

const router = Router();

router.get('/health', cartController.health);
router.get('/ready', cartController.ready);

router.use(auth);

router.get('/', cartController.getCart);
router.post('/items', validate(addItemSchema), cartController.addItem);
router.patch('/items/:cartItemId', validate(updateQuantitySchema), cartController.updateItemQuantity);
router.delete('/items/:cartItemId', cartController.removeItem);
router.post('/promo-code', validate(promoCodeSchema), cartController.applyPromoCode);
router.delete('/promo-code', cartController.removePromoCode);
router.delete('/', cartController.clearCart);

export default router;
