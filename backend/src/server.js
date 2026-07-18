'use strict';

require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { initializeRedis, closeRedis } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  // Close Redis connection
  await closeRedis();
  
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

// Start server
const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Redis
    await initializeRedis();

    // Start listening
    server.listen(PORT, () => {
      logger.info(`Hospital CRM server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  gracefulShutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

// Handle SIGTERM and SIGINT
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();

module.exports = server; // exported for testing
