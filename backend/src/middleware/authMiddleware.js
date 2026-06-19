const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Read token from Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

// Role check middleware (defaults to Teacher, but good to have)
const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Teacher') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied, only teachers are allowed'));
  }
};

module.exports = { protect, teacherOnly };
