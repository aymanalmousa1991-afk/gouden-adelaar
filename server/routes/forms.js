const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { formLimiter, reviewLimiter } = require('../middleware/rateLimiter');
const { offerteValidation, contactValidation, reviewValidation } = require('../middleware/validators');
const fileService = require('../services/fileService');

/**
 * POST /api/offerte
 * Offerte-aanvraag met optionele bestandsupload
 */
router.post('/offerte', formLimiter, (req, res, next) => {
  const upload = fileService.getUploadMiddleware();
  upload(req, res, (err) => {
    if (err) {
      // Multer errors afvangen
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Bestand is te groot (max 10 MB per bestand)'
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'Maximaal 5 bestanden toegestaan'
          : err.message || 'Fout bij uploaden van bestanden';

      return res.status(400).json({
        success: false,
        message
      });
    }
    next();
  });
}, offerteValidation, (req, res) => formController.submitOfferte(req, res));

/**
 * POST /api/contact
 * Contactformulier
 */
router.post('/contact', formLimiter, contactValidation, (req, res) => formController.submitContact(req, res));

/**
 * POST /api/review
 * Review plaatsen
 */
router.post('/review', reviewValidation, (req, res) => formController.submitReview(req, res));

/**
 * GET /api/health
 * Healthcheck endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;

