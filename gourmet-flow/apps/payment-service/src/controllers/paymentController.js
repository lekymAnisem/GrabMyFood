import * as paymentService from '../services/paymentService.js';
import { createIntentSchema, confirmPaymentSchema } from '../validators/paymentValidators.js';

export async function createIntent(req, res, next) {
  try {
    const data = createIntentSchema.parse(req.body);
    const result = await paymentService.createIntent(data.orderId, data.amount, data.currency);
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

export async function confirmPayment(req, res, next) {
  try {
    const data = confirmPaymentSchema.parse(req.body);
    const result = await paymentService.confirmPayment(data.paymentIntentId);
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

export async function refundPayment(req, res, next) {
  try {
    const result = await paymentService.refundPayment(req.params.paymentId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPayment(req, res, next) {
  try {
    const result = await paymentService.getPayment(req.params.paymentId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
