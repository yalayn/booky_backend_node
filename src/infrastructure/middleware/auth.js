// src/infrastructure/middleware/auth.js

const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  redisClient.get(token, (err, reply) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (reply === 'blacklisted') {
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = authMiddleware;