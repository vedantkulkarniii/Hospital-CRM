'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * authenticate — verifies Bearer JWT in Authorization header.
 * Attaches the full user object to req.user on success.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is missing. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Fetch user — ensure they still exist and are active
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token has expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid access token.' });
    }
    next(error);
  }
};

module.exports = authenticate;
