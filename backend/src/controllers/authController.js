const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


/**
 * @desc    Register a new teacher
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Please fill in all fields'));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'Teacher',
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data provided'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login teacher (local email/password)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please enter email and password'));
    }

    const user = await User.findOne({ email });

    // Validate credentials
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Google OAuth 2.0 / Login/Signup via Google ID Token
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res, next) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400);
    return next(new Error('Google ID credential token is required'));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      if (process.env.NODE_ENV === 'production') {
        res.status(500);
        return next(new Error('Google Authentication is not configured in production.'));
      }
      console.warn('Google Client ID not configured. Bypassing validation in development mode.');
      
      // Fallback decode for development/testing when client id is missing
      const decodedPayload = jwt.decode(credential);
      if (!decodedPayload || !decodedPayload.email) {
        res.status(400);
        return next(new Error('Invalid mock/undecodable Google token.'));
      }
      
      let user = await User.findOne({ email: decodedPayload.email });
      if (!user) {
        user = await User.create({
          name: decodedPayload.name || 'Google Teacher',
          email: decodedPayload.email,
          googleId: decodedPayload.sub || `google-mock-${Date.now()}`,
          role: 'Teacher',
        });
      }
      
      return res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Regular validation with google auth library
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Link Google ID if not already done
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create user
      user = await User.create({
        name: name || 'Google Teacher',
        email: email,
        googleId: googleId,
        role: 'Teacher',
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401);
    next(new Error('Google authentication verification failed'));
  }
};

/**
 * @desc    Get logged in user profile (for session restore)
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
};
