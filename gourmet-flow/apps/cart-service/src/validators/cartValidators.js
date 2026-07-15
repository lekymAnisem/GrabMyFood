import { z } from 'zod';

export const addItemSchema = z.object({
  restaurantId: z.string().min(1, 'restaurantId is required'),
  menuItemId: z.string().min(1, 'menuItemId is required'),
  name: z.string().min(1, 'name is required').optional(),
  price: z.number().positive('price must be positive'),
  quantity: z.number().int().positive('quantity must be at least 1'),
  specialInstructions: z.string().optional().default(''),
  selectedAddOns: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(0),
      })
    )
    .optional()
    .default([]),
  image: z.string().optional().default(''),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().positive('quantity must be at least 1'),
});

export const promoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
});

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = new Error(result.error.errors.map((e) => e.message).join(', '));
      error.status = 400;
      return next(error);
    }
    req.validatedBody = result.data;
    next();
  };
}
