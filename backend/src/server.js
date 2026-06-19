require('dotenv').config();

// Enforce strict environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Cleanup temporary upload files on startup
const uploadDir = path.join(__dirname, '../uploads');
if (fs.existsSync(uploadDir)) {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Failed to read uploads directory for cleanup:', err.message);
      return;
    }
    let deletedCount = 0;
    for (const file of files) {
      if (file !== '.gitkeep') {
        fs.unlink(path.join(uploadDir, file), (err) => {
          if (err) {
            console.error(`Failed to delete temp file ${file} on startup:`, err.message);
          }
        });
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} temporary upload files on startup.`);
    }
  });
}


// Route imports
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const bankRoutes = require('./routes/bankRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paperRoutes = require('./routes/paperRoutes');

// Connect to Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(xss());

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*') || (process.env.NODE_ENV !== 'production')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api', apiLimiter);

// Serve static uploads (for debugging/storing)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/papers', paperRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Question Wallah API!' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
