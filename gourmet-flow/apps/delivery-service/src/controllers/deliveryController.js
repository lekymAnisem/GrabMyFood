import * as deliveryService from '../services/deliveryService.js';
import { createDeliverySchema, updateStatusSchema, updateLocationSchema } from '../validators/deliveryValidators.js';

export async function createDelivery(req, res, next) {
  try {
    const data = createDeliverySchema.parse(req.body);
    const result = await deliveryService.createDelivery(data.orderId, data.restaurantId, data.deliveryAddress);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: { code: 'VALIDATION_ERROR', details: err.errors },
      });
    }
    next(err);
  }
}

export async function getDeliveryByOrder(req, res, next) {
  try {
    const result = await deliveryService.getDeliveryByOrder(req.params.orderId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateDeliveryStatus(req, res, next) {
  try {
    const data = updateStatusSchema.parse(req.body);
    const result = await deliveryService.updateDeliveryStatus(req.params.deliveryId, data.status);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: { code: 'VALIDATION_ERROR', details: err.errors },
      });
    }
    next(err);
  }
}

export async function updateDeliveryLocation(req, res, next) {
  try {
    const data = updateLocationSchema.parse(req.body);
    const result = await deliveryService.updateDeliveryLocation(req.params.deliveryId, data.lat, data.lng);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: { code: 'VALIDATION_ERROR', details: err.errors },
      });
    }
    next(err);
  }
}
