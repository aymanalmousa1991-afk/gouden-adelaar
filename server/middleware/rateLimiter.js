const rateLimit = require('express-rate-limit');

/**
 * Rate limiter voor formulier endpoints
 * Beperkt het aantal requests per IP-adres
 */
const formLimiter = rateLimit({
  validate: { xForwardedForHeader: false },
  windowMs: 15 * 60 * 1000, // 15 minuten
  max: 10, // Max 10 requests per IP per 15 minuten
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Te veel verzoeken. Probeer het over 15 minuten opnieuw.'
  }
});

/**
 * Strikt limiter voor review-submissions
 */
const reviewLimiter = rateLimit({
  validate: { xForwardedForHeader: false },
  windowMs: 60 * 60 * 1000, // 1 uur
  max: 3, // Max 3 reviews per uur per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'U kunt maximaal 3 reviews per uur plaatsen.'
  }
});

module.exports = { formLimiter, reviewLimiter };

