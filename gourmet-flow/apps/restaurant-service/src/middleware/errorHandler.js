export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      details: err.details || [],
    },
  });
}
