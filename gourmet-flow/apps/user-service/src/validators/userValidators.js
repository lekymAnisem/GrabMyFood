import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
});

export const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  details: z.string().optional(),
  default: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  label: z.string().min(1).optional(),
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  details: z.string().optional(),
  default: z.boolean().optional(),
});
