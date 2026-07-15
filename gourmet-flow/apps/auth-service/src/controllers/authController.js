import * as authService from '../services/authService.js';
import { registerSchema, loginSchema, refreshSchema } from '../validators/authValidators.js';

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
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

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
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

export async function logout(req, res, next) {
  try {
    const result = authService.logout();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const data = refreshSchema.parse(req.body);
    const result = await authService.refresh(data);
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

export async function verify(req, res, next) {
  try {
    const result = await authService.verify(req.user.sub);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
