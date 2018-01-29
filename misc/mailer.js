const sgMail = require('@sendgrid/mail');
const config = require('../config/mailer');
sgMail.setApiKey(config.SentGridAPIKey);
module.exports = {
  sendEmail(from, to, subject, html) {
    const msg = {
      to: to,
      from: 'test@example.com',
      subject: subject,
      text: 'Registration mail',
      html: html,
    };
    sgMail.send(msg);
  }
}

