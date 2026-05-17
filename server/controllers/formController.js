const emailService = require('../services/emailService');

/**
 * Controller voor alle formulierinzendingen
 */
class FormController {

  async submitOfferte(req, res) {
    try {
      const data = {
        name: req.body.name || '',
        phone: req.body.phone || '',
        email: req.body.email || '',
        dienst: req.body.dienst || '',
        description: req.body.description || '',
        files: req.files || []
      };

      const emailData = emailService.formatOfferteEmail(data);
      emailService.sendMail({
        to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || 'goudenadelaarbedrijf@gmail.com',
        ...emailData
      }).then(function() {
        console.log('[Offerte] Email notificatie verzonden');
      }).catch(function(err) {
        console.error('[Offerte] Email fout:', err.message);
      });

      return res.json({ success: true, message: 'Uw offerte-aanvraag is ontvangen!' });
    } catch (error) {
      console.error('[Controller] Fout bij offerte:', error);
      return res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' });
    }
  }

  async submitContact(req, res) {
    try {
      const data = {
        name: req.body.name || '',
        phone: req.body.phone || '',
        message: req.body.message || ''
      };

      const emailData = emailService.formatContactEmail(data);
      emailService.sendMail({
        to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || 'goudenadelaarbedrijf@gmail.com',
        ...emailData
      }).catch(function() {});

      return res.json({ success: true, message: 'Uw bericht is ontvangen!' });
    } catch (error) {
      console.error('[Controller] Fout bij contact:', error);
      return res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' });
    }
  }

  async submitReview(req, res) {
    try {
      const data = {
        name: String(req.body.name || 'Anoniem'),
        stars: parseInt(req.body.stars) || 5,
        dienst: String(req.body.dienst || ''),
        message: String(req.body.message || '')
      };

      // Opslaan in MongoDB - niet wachten op resultaat
      try {
        const Review = require('../models/Review');
        var review = new Review(data);
        review.save().catch(function() {});
      } catch (e) {}

      // Email - niet wachten
      try {
        var emailData = emailService.formatReviewEmail(data);
        emailService.sendMail({
          to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER || 'goudenadelaarbedrijf@gmail.com',
          ...emailData
        }).catch(function() {});
      } catch (e) {}

      return res.json({ success: true, message: 'Bedankt voor uw review!', review: data });
    } catch (error) {
      console.error('[Controller] Fout bij review:', error);
      try { return res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' }); } catch(e) {}
    }
  }
}

module.exports = new FormController();

