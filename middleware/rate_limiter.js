const logger = require('../utils/logger');

// Simple in-memory rate limiter
class RateLimiter {
  constructor(options = {}) {
    this.limits = new Map();
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.maxRequests = options.maxRequests || 20; // 20 requests per minute
    this.message = options.message || "You've sent too many messages. Please wait a bit before trying again.";
  }
  
  // Check if a request is allowed
  isAllowed(id) {
    const now = Date.now();
    
    // Clean up old entries
    this._cleanup(now);
    
    // Get or create record
    let record = this.limits.get(id);
    if (!record) {
      record = {
        count: 0,
        resetAt: now + this.windowMs
      };
      this.limits.set(id, record);
    }
    
    // Check if limit exceeded
    if (record.count >= this.maxRequests) {
      const timeToReset = Math.ceil((record.resetAt - now) / 1000);
      logger.warn(`Rate limit exceeded for ${id}. Reset in ${timeToReset} seconds.`);
      return false;
    }
    
    // Increment count
    record.count += 1;
    return true;
  }
  
  // Reset limit for an ID
  reset(id) {
    this.limits.delete(id);
  }
  
  // Clean up expired records
  _cleanup(now) {
    for (const [id, record] of this.limits.entries()) {
      if (now >= record.resetAt) {
        this.limits.delete(id);
      }
    }
  }
  
  // Get middleware function
  middleware() {
    return (client, message, next) => {
      const id = message.from;
      
      if (this.isAllowed(id)) {
        return next();
      }
      
      // Send rate limit message
      message.reply(this.message);
      return false;
    };
  }
}

// Export a singleton instance
const rateLimiter = new RateLimiter();
module.exports = rateLimiter;