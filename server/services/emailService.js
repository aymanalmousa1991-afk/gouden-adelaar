const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    this.initialized = false;
    this.useConsoleFallback = false;
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'goudenadelaarbedrijf@gmail.com';
  }

  init() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.initialized = true;
      console.log('[Email] SendGrid geconfigureerd');
    } else {
      console.log('[Email] Geen SENDGRID_API_KEY, gebruik console fallback');
      this.useConsoleFallback = true;
    }
  }

  async sendMail({ to, subject, html, text, attachments = [] }) {
    try {
      if (this.useConsoleFallback) {
        this._consoleLog({ to, subject, html });
        return { success: true, fallback: true };
      }

      const msg = {
        to: to || 'goudenadelaarbedrijf@gmail.com',
        from: this.fromEmail,
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, '')
      };

      await sgMail.send(msg);
      console.log('[Email] Verzonden naar: ' + to);
      return { success: true };
    } catch (error) {
      console.error('[Email] Fout:', error.message);
      this._consoleLog({ to, subject, html });
      return { success: true, fallback: true };
    }
  }

  formatOfferteEmail(data) {
    const dienstMap = {
      'renovatie': 'Renovatie', 'binnenhuis-renovatie': 'Binnenhuis renovatie',
      'sloopwerk': 'Sloopwerk', 'opbouw-verbouwing': 'Opbouw & verbouwing',
      'laminaat': 'Laminaat leggen', 'pvc-vloeren': 'PVC vloeren',
      'vloertegels': 'Vloertegels', 'badkamer': 'Badkamer renovatie',
      'keuken': 'Keuken renovatie', 'stucadoor': 'Stucadoor werkzaamheden',
      'behangen': 'Behangen', 'schilderwerk': 'Schilderwerk',
      'muren-afwerken': 'Muren afwerken', 'plafond': 'Plafond afwerking',
      'timmerwerk': 'Timmerwerk & maatwerk', 'complete-woning': 'Complete woningrenovatie',
      'onderhoud': 'Onderhoud', 'meerdere': 'Meerdere diensten'
    };

    const items = [
      '<strong>Type werkzaamheden:</strong> ' + (dienstMap[data.dienst] || data.dienst),
      '<strong>Naam:</strong> ' + data.name,
      '<strong>Telefoon:</strong> ' + data.phone,
      '<strong>E-mail:</strong> ' + data.email
    ];

    if (data.description) {
      items.push('<strong>Beschrijving:</strong><br>' + data.description.replace(/\n/g, '<br>'));
    }

    return {
      subject: 'Nieuwe offerte-aanvraag van ' + data.name,
      html: '<div style="background:#141414;color:#F5F0E8;padding:2rem;border-top:3px solid #C9A84C;max-width:600px;font-family:Arial">' +
        '<h1 style="color:#C9A84C;font-weight:300">Nieuwe Offerte Aanvraag</h1>' +
        '<p style="color:rgba(245,240,232,.5);font-size:.85rem">Ontvangen op ' + new Date().toLocaleString('nl-NL') + '</p>' +
        items.map(function(i) { return '<p style="margin:.5rem 0;line-height:1.6">' + i + '</p>'; }).join('') +
        '<p style="margin-top:2rem;font-size:.8rem;color:rgba(245,240,232,.4);text-align:center">Dit bericht is automatisch gegenereerd via de website van Gouden Adelaar.</p></div>'
    };
  }

  formatContactEmail(data) {
    const items = [
      '<strong>Naam:</strong> ' + data.name,
      '<strong>E-mail:</strong> ' + (data.email || 'Niet opgegeven'),
      '<strong>Telefoon:</strong> ' + (data.phone || 'Niet opgegeven')
    ];
    if (data.message) {
      items.push('<strong>Bericht:</strong><br>' + data.message.replace(/\n/g, '<br>'));
    }
    return {
      subject: 'Nieuw contactbericht van ' + data.name,
      html: '<div style="background:#141414;color:#F5F0E8;padding:2rem;border-top:3px solid #C9A84C;max-width:600px;font-family:Arial">' +
        '<h1 style="color:#C9A84C;font-weight:300">Contactbericht</h1>' +
        '<p style="color:rgba(245,240,232,.5);font-size:.85rem">Ontvangen op ' + new Date().toLocaleString('nl-NL') + '</p>' +
        items.map(function(i) { return '<p style="margin:.5rem 0;line-height:1.6">' + i + '</p>'; }).join('') +
        '<p style="margin-top:2rem;font-size:.8rem;color:rgba(245,240,232,.4);text-align:center">Dit bericht is automatisch gegenereerd via de website van Gouden Adelaar.</p></div>'
    };
  }

  formatReviewEmail(data) {
    var sterren = '';
    for (var s = 0; s < 5; s++) sterren += s < data.stars ? '\u2605' : '\u2606';
    return {
      subject: 'Nieuwe review (' + data.stars + '\u2605) van ' + data.name,
      html: '<div style="background:#141414;color:#F5F0E8;padding:2rem;border-top:3px solid #C9A84C;max-width:600px;font-family:Arial">' +
        '<h1 style="color:#C9A84C;font-weight:300">Nieuwe Review</h1>' +
        '<p style="color:rgba(245,240,232,.5);font-size:.85rem">Ontvangen op ' + new Date().toLocaleString('nl-NL') + '</p>' +
        '<div style="text-align:center;font-size:1.5rem;color:#C9A84C;margin:1rem 0">' + sterren + '</div>' +
        '<p><strong>Naam:</strong> ' + data.name + '</p>' +
        (data.dienst ? '<p><strong>Werkzaamheden:</strong> ' + data.dienst + '</p>' : '') +
        '<p style="margin-top:1rem;font-style:italic;color:rgba(245,240,232,.8)">"' + data.message + '"</p>' +
        '<p style="margin-top:2rem;font-size:.8rem;color:rgba(245,240,232,.4);text-align:center">Dit bericht is automatisch gegenereerd via de website van Gouden Adelaar.</p></div>'
    };
  }

  _consoleLog({ to, subject, html }) {
    var sep = '\u2500'.repeat(50);
    console.log('\n' + sep);
    console.log('EMAIL NOTIFICATIE');
    console.log(sep);
    console.log('Aan: ' + to);
    console.log('Onderwerp: ' + subject);
    console.log(sep);
    console.log(html.replace(/<[^>]*>/g, '').replace(/\n{3,}/g, '\n\n').trim());
    console.log(sep + '\n');
  }
}

module.exports = new EmailService();

