'use strict';

const redis = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

/**
 * Initialize Redis connection
 */
const initializeRedis = async () => {
  try {
    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis reconnection failed');
          }
          return retries * 100;
        },
      },
    });

    client.on('error', (err) => logger.error('Redis Client Error', err));
    client.on('connect', () => logger.info('Redis Client Connected'));
    client.on('reconnecting', () => logger.warn('Redis Client Reconnecting'));

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    // Continue without Redis if connection fails
    return null;
  }
};

/**
 * Get Redis client
 */
const getRedisClient = () => {
  return redisClient;
};

/**
 * Set value in Redis with optional TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be stringified)
 * @param {number} ttl - Time to live in seconds (default: 3600 = 1 hour)
 */
const setCacheValue = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not available, skipping cache');
      return false;
    }
    const serialized = JSON.stringify(value);
    await redisClient.setEx(key, ttl, serialized);
    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
    return false;
  }
};

/**
 * Get value from Redis
 * @param {string} key - Cache key
 */
const getCacheValue = async (key) => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not available, skipping cache');
      return null;
    }
    const value = await redisClient.get(key);
    if (value) {
      logger.debug(`Cache hit: ${key}`);
      return JSON.parse(value);
    }
    logger.debug(`Cache miss: ${key}`);
    return null;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete value from Redis
 * @param {string} key - Cache key
 */
const deleteCacheValue = async (key) => {
  try {
    if (!redisClient) {
      return false;
    }
    const result = await redisClient.del(key);
    logger.debug(`Cache deleted: ${key} (${result} keys removed)`);
    return result > 0;
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear all cache
 */
const clearAllCache = async () => {
  try {
    if (!redisClient) {
      return false;
    }
    await redisClient.flushDb();
    logger.info('All cache cleared');
    return true;
  } catch (error) {
    logger.error('Error clearing all cache:', error);
    return false;
  }
};

/**
 * Delete multiple cache keys by pattern
 * @param {string} pattern - Key pattern (e.g., "dashboard:*")
 */
const deleteCacheByPattern = async (pattern) => {
  try {
    if (!redisClient) {
      return 0;
    }
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) {return 0;}

    let deleted = 0;
    for (const key of keys) {
      deleted += await redisClient.del(key);
    }
    logger.debug(`Cache cleared for pattern: ${pattern} (${deleted} keys removed)`);
    return deleted;
  } catch (error) {
    logger.error(`Error deleting cache for pattern ${pattern}:`, error);
    return 0;
  }
};

/**
 * Gracefully close Redis connection
 */
const closeRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis connection closed');
      redisClient = null;
    }
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
};

module.exports = {
  initializeRedis,
  getRedisClient,
  setCacheValue,
  getCacheValue,
  deleteCacheValue,
  deleteCacheByPattern,
  clearAllCache,
  closeRedis,
};
