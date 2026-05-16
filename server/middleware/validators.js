const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

/**
 * Custom sanitizer functie
 */
const sanitize = (value) => {
  if (typeof value === 'string') {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
      stripAll: true
    }).trim();
  }
  return value;
};

/**
 * Validatieregels voor offerte-aanvraag
 */
const offerteValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Naam is verplicht')
    .isLength({ min: 2, max: 100 }).withMessage('Naam moet tussen 2 en 100 tekens zijn')
    .customSanitizer(value => sanitize(value)),

  body('phone')
    .trim()
    .notEmpty().withMessage('Telefoonnummer is verplicht')
    .matches(/^[0-9\s\-+()]{10,15}$/).withMessage('Ongeldig telefoonnummer (min. 10 cijfers)'),

  body('email')
    .trim()
    .notEmpty().withMessage('E-mail is verplicht')
    .isEmail().withMessage('Ongeldig e-mailadres')
    .normalizeEmail(),

  body('dienst')
    .trim()
    .notEmpty().withMessage('Type werkzaamheden is verplicht'),

  body('description')
    .trim()
    .optional()
    .isLength({ max: 5000 }).withMessage('Beschrijving mag maximaal 5000 tekens bevatten')
    .customSanitizer(value => sanitize(value)),

  body('privacy')
    .isIn(['true', true, 'on', '1']).withMessage('U moet akkoord gaan met de privacyverklaring'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[VALIDATION ERROR]', JSON.stringify(req.body), JSON.stringify(errors.array()));
      return res.status(400).json({
        success: false,
        message: 'Validatiefout: controleer uw invoer',
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validatieregels voor contactformulier
 */
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Naam is verplicht')
    .isLength({ min: 2, max: 100 }).withMessage('Naam moet tussen 2 en 100 tekens zijn')
    .customSanitizer(value => sanitize(value)),

  body('phone')
    .trim()
    .optional({ values: 'falsy' })
    .matches(/^[0-9\s\-+()]{10,15}$/).withMessage('Ongeldig telefoonnummer'),

  body('message')
    .trim()
    .notEmpty().withMessage('Bericht is verplicht')
    .isLength({ min: 2, max: 5000 }).withMessage('Bericht moet tussen 2 en 5000 tekens zijn')
    .customSanitizer(value => sanitize(value)),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[VALIDATION ERROR]', JSON.stringify(req.body), JSON.stringify(errors.array()));
      return res.status(400).json({
        success: false,
        message: 'Validatiefout: controleer uw invoer',
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validatieregels voor review
 */
const reviewValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Naam is verplicht')
    .isLength({ min: 2, max: 100 }).withMessage('Naam moet tussen 2 en 100 tekens zijn')
    .customSanitizer(value => sanitize(value)),

  body('stars')
    .notEmpty().withMessage('Aantal sterren is verplicht')
    .isInt({ min: 1, max: 5 }).withMessage('Kies 1 tot 5 sterren'),

  body('dienst')
    .trim()
    .optional()
    .customSanitizer(value => sanitize(value)),

  body('message')
    .trim()
    .notEmpty().withMessage('Bericht is verplicht')
    .isLength({ min: 2, max: 2000 }).withMessage('Bericht moet tussen 2 en 2000 tekens zijn')
    .customSanitizer(value => sanitize(value)),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[VALIDATION ERROR]', JSON.stringify(req.body), JSON.stringify(errors.array()));
      return res.status(400).json({
        success: false,
        message: 'Validatiefout: controleer uw invoer',
        errors: errors.array().map(e => ({
          field: e.path,
          message: e.msg
        }))
      });
    }
    next();
  }
];

module.exports = {
  offerteValidation,
  contactValidation,
  reviewValidation
};



