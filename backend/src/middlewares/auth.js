// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function verifyToken(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);   // → { id, role, iat, exp }
    next();
  } catch (_) {
    res.status(401).json({ message: 'Token invalid/expired' });
  }
}

const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'Forbidden' });

module.exports = { verifyToken, requireRole };
