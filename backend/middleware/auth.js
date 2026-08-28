import jwt from 'jsonwebtoken';
import { User } from '../models/content.js';

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ success: false, message: 'Authentication is required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch { res.status(401).json({ success: false, message: 'Your session is invalid or has expired.' }); }
}
export async function optionalAuth(req, res, next) {
  if (!req.headers.authorization?.startsWith('Bearer ')) return next();
  return protect(req, res, next);
}
export function adminOnly(req, res, next) { return req.user?.role === 'admin' ? next() : res.status(403).json({ success: false, message: 'Administrator access is required.' }); }
