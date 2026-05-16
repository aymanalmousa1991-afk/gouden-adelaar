const emailService = require('../services/emailService');

/**
 * Controller voor alle formulierinzendingen
 */
class FormController {
  /**
   * Verwerk offerte-aanvraag
   */
  async submitOfferte(req, res) {
    try {
      const data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        dienst: req.body.dienst,
        description: req.body.description || '',
        files: req.files || []
      };

      // Build email
      const emailData = emailService.formatOfferteEmail(data);

      // Stuur notificatie
      const result = await emailService.sendMail({
        to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
        ...emailData
      });

      // Bevestigingsmail naar de klant (optioneel)
      if (data.email) {
        await emailService.sendMail({
          to: data.email,
          subject: 'Bevestiging offerte-aanvraag - Gouden Adelaar',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#F5F0E8;padding:2rem;border-radius:4px;border-top:3px solid #C9A84C;">
              <div style="text-align:center;margin-bottom:2rem;">
                <span style="font-size:2rem;">🦅</span>
                <h1 style="font-family:Georgia,serif;font-weight:300;margin:.5rem 0;color:#C9A84C;">Bedankt voor uw aanvraag!</h1>
              </div>
              <p>Beste ${data.name},</p>
              <p>Wij hebben uw offerte-aanvraag voor <strong>${data.dienst}</strong> succesvol ontvangen.</p>
              <p>U hoort binnen <strong>24 uur</strong> van ons via telefoon of e-mail voor een vrijblijvende offerte.</p>
              <p>Heeft u spoed? Bel ons dan op <a href="tel:0630002333" style="color:#C9A84C;">06 300 02 333</a>.</p>
              <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,.1);font-size:.8rem;color:rgba(245,240,232,.4);text-align:center;">
                Met vriendelijke groet,<br>
                <strong style="color:#C9A84C;">Gouden Adelaar</strong> - Bouw &amp; Renovatie
              </div>
            </div>
          `
        }).catch(err => {
          console.warn('[Controller] Kon geen bevestigingsmail sturen naar klant:', err.message);
        });
      }

      res.json({
        success: true,
        message: 'Uw offerte-aanvraag is ontvangen! Wij nemen binnen 24 uur contact met u op.'
      });
    } catch (error) {
      console.error('[Controller] Fout bij offerte:', error);
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden. Probeer het later opnieuw of bel 06 300 02 333.'
      });
    }
  }

  /**
   * Verwerk contactformulier
   */
  async submitContact(req, res) {
    try {
      const data = {
        name: req.body.name,
        phone: req.body.phone || '',
        message: req.body.message
      };

      const emailData = emailService.formatContactEmail(data);

      await emailService.sendMail({
        to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
        ...emailData
      });

      // Bevestigingsmail
      if (req.body.email) {
        data.email = req.body.email;
        await emailService.sendMail({
          to: data.email,
          subject: 'Bevestiging contactbericht - Gouden Adelaar',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#F5F0E8;padding:2rem;border-radius:4px;border-top:3px solid #C9A84C;">
              <div style="text-align:center;margin-bottom:2rem;">
                <h1 style="font-family:Georgia,serif;font-weight:300;margin:0;color:#C9A84C;">Bedankt voor uw bericht!</h1>
              </div>
              <p>Beste ${data.name},</p>
              <p>Wij hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op.</p>
              <p>Voor spoedgevallen: <a href="tel:0630002333" style="color:#C9A84C;">06 300 02 333</a></p>
              <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,.1);font-size:.8rem;color:rgba(245,240,232,.4);text-align:center;">
                Met vriendelijke groet,<br>
                <strong style="color:#C9A84C;">Gouden Adelaar</strong>
              </div>
            </div>
          `
        }).catch(() => {});
      }

      res.json({
        success: true,
        message: 'Uw bericht is ontvangen! Wij nemen zo spoedig mogelijk contact met u op.'
      });
    } catch (error) {
      console.error('[Controller] Fout bij contact:', error);
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
      });
    }
  }

  /**
   * Verwerk review
   */
  async submitReview(req, res) {
    try {
      const data = {
        name: req.body.name,
        stars: parseInt(req.body.stars),
        dienst: req.body.dienst || '',
        message: req.body.message
      };

      const emailData = emailService.formatReviewEmail(data);

      await emailService.sendMail({
        to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
        ...emailData
      });

      res.json({
        success: true,
        message: 'Bedankt voor uw review! Wij stellen dit enorm op prijs.',
        review: data
      });
    } catch (error) {
      console.error('[Controller] Fout bij review:', error);
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden. Probeer het later opnieuw.'
      });
    }
  }
}

module.exports = new FormController();
