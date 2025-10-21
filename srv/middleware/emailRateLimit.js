// Rate limiting middleware for email sending
const rateLimitMap = new Map();

const emailRateLimit = (req, res, next) => {
  const email = req.body.email;
  
  if (!email) {
    return next();
  }

  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 1; // Maximum 1 email per minute per email address
  
  // Clean up old entries
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > windowMs) {
      rateLimitMap.delete(key);
    }
  }

  const key = email.toLowerCase().trim();
  const existing = rateLimitMap.get(key);

  if (!existing) {
    // First request for this email
    rateLimitMap.set(key, {
      firstRequest: now,
      count: 1
    });
    return next();
  }

  if (now - existing.firstRequest < windowMs) {
    // Within the time window
    if (existing.count >= maxRequests) {
      const timeLeft = Math.ceil((windowMs - (now - existing.firstRequest)) / 1000);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Слишком много запросов. Попробуйте через ${timeLeft} секунд.`,
        retryAfter: timeLeft
      });
    }
    
    existing.count++;
    rateLimitMap.set(key, existing);
  } else {
    // Outside the time window, reset
    rateLimitMap.set(key, {
      firstRequest: now,
      count: 1
    });
  }

  next();
};

// Hourly rate limit (5 emails per hour per email address)
const hourlyRateLimitMap = new Map();

const emailHourlyRateLimit = (req, res, next) => {
  const email = req.body.email;
  
  if (!email) {
    return next();
  }

  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour window
  const maxRequests = 5; // Maximum 5 emails per hour per email address
  
  // Clean up old entries
  for (const [key, data] of hourlyRateLimitMap.entries()) {
    if (now - data.firstRequest > windowMs) {
      hourlyRateLimitMap.delete(key);
    }
  }

  const key = email.toLowerCase().trim();
  const existing = hourlyRateLimitMap.get(key);

  if (!existing) {
    // First request for this email
    hourlyRateLimitMap.set(key, {
      firstRequest: now,
      count: 1
    });
    return next();
  }

  if (now - existing.firstRequest < windowMs) {
    // Within the time window
    if (existing.count >= maxRequests) {
      const timeLeft = Math.ceil((windowMs - (now - existing.firstRequest)) / 1000 / 60);
      return res.status(429).json({
        error: 'Hourly rate limit exceeded',
        message: `Превышен лимит отправки писем. Попробуйте через ${timeLeft} минут.`,
        retryAfter: timeLeft * 60
      });
    }
    
    existing.count++;
    hourlyRateLimitMap.set(key, existing);
  } else {
    // Outside the time window, reset
    hourlyRateLimitMap.set(key, {
      firstRequest: now,
      count: 1
    });
  }

  next();
};

// Combined rate limiting middleware
const combinedEmailRateLimit = (req, res, next) => {
  // Apply both rate limits
  emailRateLimit(req, res, (err) => {
    if (err) return next(err);
    
    emailHourlyRateLimit(req, res, next);
  });
};

// Cleanup function to prevent memory leaks
const cleanupRateLimitMaps = () => {
  const now = Date.now();
  
  // Clean up minute-based rate limit
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > 60 * 1000) {
      rateLimitMap.delete(key);
    }
  }
  
  // Clean up hour-based rate limit
  for (const [key, data] of hourlyRateLimitMap.entries()) {
    if (now - data.firstRequest > 60 * 60 * 1000) {
      hourlyRateLimitMap.delete(key);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitMaps, 5 * 60 * 1000);

module.exports = {
  emailRateLimit,
  emailHourlyRateLimit,
  combinedEmailRateLimit,
  cleanupRateLimitMaps
};
