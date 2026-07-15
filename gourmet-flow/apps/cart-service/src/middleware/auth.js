export default function auth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const payload = Buffer.from(token, 'base64').toString('utf-8');
      req.user = JSON.parse(payload);
    } catch {
      req.user = { id: 'u1', name: 'Demo User' };
    }
  } else {
    req.user = { id: 'u1', name: 'Demo User' };
  }

  req.userId = req.user.id;
  next();
}
