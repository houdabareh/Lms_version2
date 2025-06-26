const jwt = require('jsonwebtoken');

// Fallback JWT secret for development (should use .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-development-secret-key-12345';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Access token required'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 🔐 ADMIN ROUTE PROTECTION: Check if specific roles are required
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ 
          error: 'Forbidden: Access denied',
          message: `Access restricted to: ${roles.join(', ')}. Current role: ${decoded.role}`,
          requiredRoles: roles,
          userRole: decoded.role
        });
      }

      // 🛡️ Additional admin validation for admin-only routes
      // Only block if this is an admin-only route (only admin in roles array)
      if (roles.length === 1 && roles.includes('admin') && decoded.role !== 'admin') {
        return res.status(403).json({
          error: 'Admin access required',
          message: 'This endpoint requires administrator privileges',
          userRole: decoded.role
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
  };
};

/*
🧪 POSTMAN TESTING GUIDE for Protected Routes:
1. Add Authorization header: "Bearer YOUR_JWT_TOKEN"
2. Admin routes require: authMiddleware(['admin'])
3. Test admin access: GET http://localhost:5000/api/admin/dashboard
4. Expected for non-admin: 403 "Admin access required"
5. Expected for no token: 401 "Access token required"
*/

module.exports = authMiddleware;
