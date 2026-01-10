import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dataSource } from './config/database';
import { redisClient } from './config/redis';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Local Singles Date Night API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Database and Redis connection
async function startServer() {
  try {
    // Connect to database
    await dataSource.initialize();
    logger.info('Database connected successfully');

    // Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redisClient.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redisClient.disconnect();
  process.exit(0);
});

// Start the server
startServer();