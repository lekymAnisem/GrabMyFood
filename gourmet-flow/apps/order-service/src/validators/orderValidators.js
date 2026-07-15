import { z } from 'zod';

export const createOrderSchema = z.object({
  deliveryAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'cash']),
  specialInstructions: z.string().optional().default(''),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'PAYMENT_CONFIRMED',
    'RESTAURANT_CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'PAYMENT_FAILED',
  ]),
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
