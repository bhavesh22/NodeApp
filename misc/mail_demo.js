const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey("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");

const msg = {
  to: 'bhavesh.badjatya@gmail.com',
  from: 'test@example.com',
  subject: 'chala kya ',
  text: 'yo budy',
  html: 'direcly send kar rha hoon',
};
sgMail.send(msg);