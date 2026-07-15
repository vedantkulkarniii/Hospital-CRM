'use strict';

const logger = require('./logger');

/**
 * Performance monitoring utility
 * Tracks response times, memory usage, and slow queries
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: [],
      slowQueries: [],
      memoryUsage: [],
    };
    this.thresholds = {
      slowQueryMs: 100, // Mark queries slower than 100ms
      slowRequestMs: 500, // Mark requests slower than 500ms
    };
  }

  /**
   * Record request performance
   */
  recordRequest(method, url, statusCode, duration) {
    const request = {
      method,
      url,
      statusCode,
      duration,
      timestamp: new Date(),
      isSlowRequest: duration > this.thresholds.slowRequestMs,
    };

    this.metrics.requests.push(request);

    if (request.isSlowRequest) {
      logger.warn(`Slow request: ${method} ${url} took ${duration}ms`);
    }

    // Keep only last 1000 requests
    if (this.metrics.requests.length > 1000) {
      this.metrics.requests = this.metrics.requests.slice(-1000);
    }
  }

  /**
   * Record query performance
   */
  recordQuery(collection, operation, duration, isSlowQuery = false) {
    const query = {
      collection,
      operation,
      duration,
      timestamp: new Date(),
      isSlowQuery: isSlowQuery || duration > this.thresholds.slowQueryMs,
    };

    if (query.isSlowQuery) {
      this.metrics.slowQueries.push(query);
      logger.warn(`Slow query: ${collection}.${operation} took ${duration}ms`);
    }

    // Keep only last 100 slow queries
    if (this.metrics.slowQueries.length > 100) {
      this.metrics.slowQueries = this.metrics.slowQueries.slice(-100);
    }
  }

  /**
   * Record memory usage
   */
  recordMemory() {
    const memUsage = process.memoryUsage();
    const memory = {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024),
      timestamp: new Date(),
    };

    this.metrics.memoryUsage.push(memory);

    // Keep only last 100 snapshots
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-100);
    }

    return memory;
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const requests = this.metrics.requests;
    const slowQueries = this.metrics.slowQueries;
    const memory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];

    const avgResponseTime =
      requests.length > 0 ? requests.reduce((sum, r) => sum + r.duration, 0) / requests.length : 0;

    const slowRequestCount = requests.filter((r) => r.isSlowRequest).length;

    return {
      requests: {
        total: requests.length,
        averageResponseTime: Math.round(avgResponseTime),
        slowRequests: slowRequestCount,
        slowRequestPercentage: ((slowRequestCount / requests.length) * 100).toFixed(2) + '%',
      },
      slowQueries: {
        total: slowQueries.length,
        average:
          slowQueries.length > 0
            ? Math.round(slowQueries.reduce((sum, q) => sum + q.duration, 0) / slowQueries.length)
            : 0,
      },
      memory: {
        heapUsed: memory?.heapUsed || 0,
        heapTotal: memory?.heapTotal || 0,
        external: memory?.external || 0,
        rss: memory?.rss || 0,
      },
    };
  }

  /**
   * Get latest requests
   */
  getLatestRequests(limit = 10) {
    return this.metrics.requests.slice(-limit).reverse();
  }

  /**
   * Get slowest queries
   */getSlowestQueries(limit = 10) {
    return this.metrics.slowQueries.sort((a, b) => b.duration - a.duration).slice(0, limit);
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      requests: [],
      slowQueries: [],
      memoryUsage: [],
    };
  }
}

module.exports = new PerformanceMonitor();
