const nodemailer = require('nodemailer');

/**
 * Email Service
 * Verstuurt e-mail notificaties bij formulierinzendingen.
 * Werkt zowel met SMTP als met een fallback (logt naar console).
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.useConsoleFallback = false;
  }

  /**
   * Initialiseer de email transporter
   */
  init() {
    const host = process.env.EMAIL_HOST;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const port = parseInt(process.env.EMAIL_PORT || '465');
    const secure = process.env.EMAIL_SECURE === 'true' || port === 465;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host: host || 'smtp.gmail.com',
        port: port || 465,
        secure: true,
        auth: { user: user, pass: pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
        debug: true,
        logger: true
      });
      this.initialized = true;
      console.log('[Email] SMTP geconfigureerd: ' + (host || 'smtp.gmail.com') + ':' + (port || 465));
    } else {
      console.log('[Email] Geen SMTP credentials gevonden, gebruik console fallback');
      this.useConsoleFallback = true;
    }
  }

  /**
   * Verstuur een e-mail
   * @param {Object} options
   * @param {string} options.to - Ontvanger
   * @param {string} options.subject - Onderwerp
   * @param {string} options.html - HTML body
   * @param {string} [options.text] - Plain text body (fallback)
   * @param {Array} [options.attachments] - Bijlagen
   */
  async sendMail({ to, subject, html, text, attachments = [] }) {
    try {
      if (this.useConsoleFallback) {
        this._consoleLog({ to, subject, html, text, attachments });
        return { success: true, fallback: true };
      }

      if (!this.transporter) {
        this._consoleLog({ to, subject, html, text, attachments });
        return { success: true, fallback: true };
      }

      const info = await this.transporter.sendMail({
        from: `"Gouden Adelaar" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
        attachments
      });

      console.log('[Email] Verzonden:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      try { console.error('[Email] Fout bij verzenden:', error.message); } catch(e) {}
      try { this._consoleLog({ to, subject, html, text, attachments }); } catch(e) {}
      return { success: true, fallback: true };
    }
  }

  /**
   * Formatteer een offerte-aanvraag tot HTML e-mail
   */
  formatOfferteEmail(data) {
    const dienstMap = {
      'renovatie': 'Renovatie',
      'binnenhuis-renovatie': 'Binnenhuis renovatie',
      'sloopwerk': 'Sloopwerk',
      'opbouw-verbouwing': 'Opbouw & verbouwing',
      'laminaat': 'Laminaat leggen',
      'pvc-vloeren': 'PVC vloeren',
      'vloertegels': 'Vloertegels',
      'badkamer': 'Badkamer renovatie',
      'keuken': 'Keuken renovatie',
      'stucadoor': 'Stucadoor werkzaamheden',
      'behangen': 'Behangen',
      'schilderwerk': 'Schilderwerk',
      'muren-afwerken': 'Muren afwerken',
      'plafond': 'Plafond afwerking',
      'timmerwerk': 'Timmerwerk & maatwerk',
      'complete-woning': 'Complete woningrenovatie',
      'onderhoud': 'Onderhoud',
      'meerdere': 'Meerdere diensten'
    };

    const items = [
      `📋 <strong>Type werkzaamheden:</strong> ${dienstMap[data.dienst] || data.dienst}`,
      `👤 <strong>Naam:</strong> ${data.name}`,
      `📞 <strong>Telefoon:</strong> ${data.phone}`,
      `📧 <strong>E-mail:</strong> ${data.email}`
    ];

    if (data.description) {
      items.push(`📝 <strong>Beschrijving:</strong><br>${data.description.replace(/\n/g, '<br>')}`);
    }

    const fileInfo = data.files && data.files.length > 0
      ? `<p>📎 <strong>Bijlagen:</strong> ${data.files.length} foto('s)</p>`
      : '';

    return {
      subject: `Nieuwe offerte-aanvraag van ${data.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#F5F0E8;padding:2rem;border-radius:4px;border-top:3px solid #C9A84C;">
          <div style="text-align:center;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,168,76,.2);">
            <span style="font-size:2rem;">🦅</span>
            <h1 style="font-family:Georgia,serif;font-weight:300;margin:.5rem 0 0;color:#C9A84C;">Nieuwe Offerte Aanvraag</h1>
            <p style="color:rgba(245,240,232,.5);font-size:.85rem;">Ontvangen op ${new Date().toLocaleString('nl-NL')}</p>
          </div>
          ${items.map(item => `<p style="margin:.5rem 0;line-height:1.6;">${item}</p>`).join('')}
          ${fileInfo}
          <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,.1);font-size:.8rem;color:rgba(245,240,232,.4);text-align:center;">
            Dit bericht is automatisch gegenereerd via de website van Gouden Adelaar.
          </div>
        </div>
      `
    };
  }

  /**
   * Formatteer een contactbericht tot HTML e-mail
   */
  formatContactEmail(data) {
    const items = [
      `👤 <strong>Naam:</strong> ${data.name}`,
      `📧 <strong>E-mail:</strong> ${data.email || 'Niet opgegeven'}`,
      `📞 <strong>Telefoon:</strong> ${data.phone || 'Niet opgegeven'}`
    ];

    if (data.message) {
      items.push(`📝 <strong>Bericht:</strong><br>${data.message.replace(/\n/g, '<br>')}`);
    }

    return {
      subject: `Nieuw contactbericht van ${data.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#F5F0E8;padding:2rem;border-radius:4px;border-top:3px solid #C9A84C;">
          <div style="text-align:center;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,168,76,.2);">
            <h1 style="font-family:Georgia,serif;font-weight:300;margin:0;color:#C9A84C;">Contactbericht</h1>
            <p style="color:rgba(245,240,232,.5);font-size:.85rem;">Ontvangen op ${new Date().toLocaleString('nl-NL')}</p>
          </div>
          ${items.map(item => `<p style="margin:.5rem 0;line-height:1.6;">${item}</p>`).join('')}
          <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,.1);font-size:.8rem;color:rgba(245,240,232,.4);text-align:center;">
            Dit bericht is automatisch gegenereerd via de website van Gouden Adelaar.
          </div>
        </div>
      `
    };
  }

  /**
   * Formatteer een review tot HTML e-mail
   */
  formatReviewEmail(data) {
    const sterren = '★'.repeat(data.stars) + '☆'.repeat(5 - data.stars);

    return {
      subject: `Nieuwe review (${data.stars}★) van ${data.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#F5F0E8;padding:2rem;border-radius:4px;border-top:3px solid #C9A84C;">
          <div style="text-align:center;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid rgba(201,168,76,.2);">
            <h1 style="font-family:Georgia,serif;font-weight:300;margin:0;color:#C9A84C;">Nieuwe Review</h1>
            <p style="color:rgba(245,240,232,.5);font-size:.85rem;">Ontvangen op ${new Date().toLocaleString('nl-NL')}</p>
          </div>
          <div style="text-align:center;font-size:1.5rem;color:#C9A84C;margin:1rem 0;">${sterren}</div>
          <p><strong>Naam:</strong> ${data.name}</p>
          ${data.dienst ? `<p><strong>Werkzaamheden:</strong> ${data.dienst}</p>` : ''}
          <p style="margin-top:1rem;font-style:italic;color:rgba(245,240,232,.8);">"${data.message}"</p>
          <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,.1);font-size:.8rem;color:rgba(245,240,232,.4);text-align:center;">
            Dit bericht is automatisch gegenereerd via de website van Gouden Adelaar.
          </div>
        </div>
      `
    };
  }

  /**
   * Console fallback - logt de melding als er geen SMTP is
   */
  _consoleLog({ to, subject, html }) {
    const separator = '─'.repeat(50);
    console.log(`\n${separator}`);
    console.log(`📧 EMAIL NOTIFICATIE`);
    console.log(`${separator}`);
    console.log(`📬 Aan: ${to}`);
    console.log(`📋 Onderwerp: ${subject}`);
    console.log(`${separator}`);
    console.log(html.replace(/<[^>]*>/g, '').replace(/\n{3,}/g, '\n\n').trim());
    console.log(`${separator}\n`);
  }
}

module.exports = new EmailService();



