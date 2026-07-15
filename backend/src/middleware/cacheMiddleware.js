'use strict';

const logger = require('../utils/logger');

/**
 * Simple in-memory cache for demo purposes
 * In production, use Redis
 */
class CacheStore {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttl = 300000) {
    // Default 5 minutes
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store value
    this.cache.set(key, value);

    // Set expiry timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
      logger.debug(`Cache expired for key: ${key}`);
    }, ttl);

    this.timers.set(key, timer);
  }

  get(key) {
    return this.cache.get(key) || null;
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  clear() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  has(key) {
    return this.cache.has(key);
  }

  size() {
    return this.cache.size;
  }
}

const store = new CacheStore();

/**
 * Cache middleware for GET requests
 * Usage: app.get('/api/resource', cacheMiddleware(300000), controller)
 * @param {number} ttl - Time to live in milliseconds (default 5 minutes)
 */
const cacheMiddleware = (ttl = 300000) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Build cache key from URL + query params + user ID
    const cacheKey = `${req.user?.id || 'anon'}:${req.originalUrl}`;

    // Check if cached
    const cached = store.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for key: ${cacheKey}`);
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = (data) => {
      store.set(cacheKey, data, ttl);
      logger.debug(`Cache set for key: ${cacheKey} (TTL: ${ttl}ms)`);
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for a pattern (e.g., clear all user's cache)
 * Usage: clearCachePattern('user123:')
 */
const clearCachePattern = (pattern) => {
  let count = 0;
  for (const key of store.cache.keys()) {
    if (key.includes(pattern)) {
      store.delete(key);
      count++;
    }
  }
  logger.info(`Cleared ${count} cache entries matching pattern: ${pattern}`);
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  const size = store.size();
  store.clear();
  logger.info(`Cleared all cache (${size} entries)`);
};

/**
 * Get cache stats
 */
const getCacheStats = () => ({
  size: store.size(),
  keys: Array.from(store.cache.keys()),
});

module.exports = {
  cacheMiddleware,
  clearCachePattern,
  clearAllCache,
  getCacheStats,
};
