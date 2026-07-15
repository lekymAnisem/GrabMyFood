export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: { code: 'UNAUTHORIZED', details: [] },
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.length < 10) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: { code: 'INVALID_TOKEN', details: [] },
    });
  }

  req.user = { id: 'mock-user-id' };
  next();
}
