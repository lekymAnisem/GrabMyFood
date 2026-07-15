import { z } from 'zod';

export const createIntentSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  amount: z.number().positive('amount must be positive'),
  currency: z.string().length(3, 'currency must be a 3-letter code').default('USD'),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'paymentIntentId is required'),
});
