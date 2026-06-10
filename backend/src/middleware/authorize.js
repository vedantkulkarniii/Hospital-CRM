'use strict';

/**
 * authorize — role-based access control middleware factory.
 * Must be used AFTER the authenticate middleware.
 *
 * @param {...string} allowedRoles - roles permitted to access the route
 * @returns Express middleware
 *
 * @example
 * router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
 * router.get('/patients', authenticate, authorize('admin', 'doctor', 'receptionist'), getPatients);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

module.exports = authorize;
