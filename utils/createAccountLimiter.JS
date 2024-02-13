const rateLimit = require('express-rate-limit');

// Define a middleware that conditionally applies rate limiting
function conditionalRateLimiter(route, data) {
  return function(req, res, next) {
    if (process.env.NODE_ENV === 'test') {
      // Skip rate limiting in test environment
      next();
    } else {
      // Apply rate limiting otherwise
      const limiter = createAccountLimiter(route, data);
      limiter(req, res, next);
    }
  };
}

// Create rate limit rule
function createAccountLimiter(route, data) {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // Limit each IP to 5 create account requests per windowMs
    handler: (req, res) => {
      return res.status(429).render(route, data);
    },
  });
}

module.exports = { conditionalRateLimiter };
