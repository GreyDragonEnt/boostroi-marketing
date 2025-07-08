import { LRUCache } from "lru-cache";

// Cache configuration
const cacheOptions = {
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 15, // 15 minutes TTL
};

// Create caches for different data types
export const roiCalculationCache = new LRUCache<string, any>(cacheOptions);
export const emailCache = new LRUCache<string, boolean>({
  ...cacheOptions,
  ttl: 1000 * 60 * 5, // 5 minutes for email validation
});

// Cache middleware for Express
export const cacheMiddleware = (ttl: number = 300) => {
  const cache = new LRUCache<string, any>({
    max: 100,
    ttl: ttl * 1000, // Convert to milliseconds
  });

  return (req: any, res: any, next: any) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const originalJson = res.json;
    res.json = function (data: any) {
      cache.set(key, data);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Industry multiplier cache (rarely changes)
export const industryMultipliers = {
  "E-commerce": 2.8,
  "SaaS": 3.2,
  "Professional Services": 2.5,
  "Healthcare": 2.0,
  "Real Estate": 2.3,
  "Other": 2.4,
};

// Email validation cache
export const validateEmailCached = (email: string): boolean => {
  const cacheKey = `email_valid_${email}`;
  const cached = emailCache.get(cacheKey);
  
  if (cached !== undefined) {
    return cached;
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  emailCache.set(cacheKey, isValid);
  return isValid;
};
