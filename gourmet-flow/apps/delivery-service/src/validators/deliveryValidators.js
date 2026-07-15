import { z } from 'zod';

export const createDeliverySchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  restaurantId: z.string().min(1, 'restaurantId is required'),
  deliveryAddress: z.string().min(1, 'deliveryAddress is required'),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    'WAITING_FOR_RESTAURANT',
    'DRIVER_ASSIGNED',
    'DRIVER_AT_RESTAURANT',
    'ORDER_PICKED_UP',
    'ON_THE_WAY',
    'ARRIVING',
    'DELIVERED',
    'CANCELED',
  ]),
});

export const updateLocationSchema = z.object({
  lat: z.number().min(-90).max(90, 'lat must be between -90 and 90'),
  lng: z.number().min(-180).max(180, 'lng must be between -180 and 180'),
});
