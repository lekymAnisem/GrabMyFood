import * as userService from '../services/userService.js';
import { updateProfileSchema, createAddressSchema, updateAddressSchema } from '../validators/userValidators.js';

export function getProfile(req, res, next) {
  try {
    const profile = userService.getProfile(req.user.sub);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export function updateProfile(req, res, next) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const profile = userService.updateProfile(req.user.sub, data);
    res.status(200).json({ success: true, data: profile });
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

export function getAddresses(req, res, next) {
  try {
    const result = userService.getAddresses(req.user.sub);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export function createAddress(req, res, next) {
  try {
    const data = createAddressSchema.parse(req.body);
    const address = userService.createAddress(req.user.sub, data);
    res.status(201).json({ success: true, data: address });
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

export function updateAddress(req, res, next) {
  try {
    const data = updateAddressSchema.parse(req.body);
    const address = userService.updateAddress(req.user.sub, req.params.addressId, data);
    res.status(200).json({ success: true, data: address });
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

export function deleteAddress(req, res, next) {
  try {
    const result = userService.deleteAddress(req.user.sub, req.params.addressId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
