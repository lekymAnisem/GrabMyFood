import { v4 as uuidv4 } from 'uuid';

const payments = new Map();

function mockPaymentProvider(orderId, amount, currency) {
  const paymentIntentId = `pi_${uuidv4().replace(/-/g, '')}`;
  const payment = {
    id: paymentIntentId,
    orderId,
    amount,
    currency,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  payments.set(paymentIntentId, payment);
  return payment;
}

export async function createIntent(orderId, amount, currency = 'USD') {
  if (!orderId || typeof amount !== 'number' || amount <= 0) {
    const err = new Error('Invalid payment request');
    err.statusCode = 400;
    err.code = 'INVALID_PAYMENT_REQUEST';
    throw err;
  }

  const payment = mockPaymentProvider(orderId, amount, currency);
  return {
    paymentIntentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
  };
}

export async function confirmPayment(paymentIntentId) {
  const payment = payments.get(paymentIntentId);
  if (!payment) {
    const err = new Error('Payment intent not found');
    err.statusCode = 404;
    err.code = 'PAYMENT_NOT_FOUND';
    throw err;
  }

  if (payment.status !== 'PENDING') {
    const err = new Error(`Cannot confirm payment in status: ${payment.status}`);
    err.statusCode = 400;
    err.code = 'INVALID_PAYMENT_STATUS';
    throw err;
  }

  if (payment.amount > 1000) {
    payment.status = 'FAILED';
    payments.set(paymentIntentId, payment);
    return {
      paymentIntentId: payment.id,
      status: payment.status,
      failureReason: 'Amount exceeds maximum threshold',
    };
  }

  payment.status = 'PAID';
  payment.last4 = '••••9928';
  payment.paidAt = new Date().toISOString();
  payments.set(paymentIntentId, payment);

  return {
    paymentIntentId: payment.id,
    status: payment.status,
    last4: payment.last4,
    paidAt: payment.paidAt,
  };
}

export async function refundPayment(paymentIntentId) {
  const payment = payments.get(paymentIntentId);
  if (!payment) {
    const err = new Error('Payment intent not found');
    err.statusCode = 404;
    err.code = 'PAYMENT_NOT_FOUND';
    throw err;
  }

  if (payment.status !== 'PAID') {
    const err = new Error(`Cannot refund payment in status: ${payment.status}`);
    err.statusCode = 400;
    err.code = 'INVALID_PAYMENT_STATUS';
    throw err;
  }

  payment.status = 'REFUNDED';
  payment.refundedAt = new Date().toISOString();
  payments.set(paymentIntentId, payment);

  return {
    paymentIntentId: payment.id,
    status: payment.status,
    refundedAt: payment.refundedAt,
  };
}

export async function getPayment(paymentIntentId) {
  const payment = payments.get(paymentIntentId);
  if (!payment) {
    const err = new Error('Payment intent not found');
    err.statusCode = 404;
    err.code = 'PAYMENT_NOT_FOUND';
    throw err;
  }

  return {
    id: payment.id,
    orderId: payment.orderId,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    createdAt: payment.createdAt,
    paidAt: payment.paidAt || null,
    refundedAt: payment.refundedAt || null,
  };
}
