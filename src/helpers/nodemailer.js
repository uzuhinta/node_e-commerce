const nodemailer = require('nodemailer');

class Email {
  constructor() {
    this.from = `QuanBa <${process.env.EMAIL_FROM}>`;
    this.transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'quannar178@gmail.com',
        pass: '',
      },
    });
  }

  // Send the actual email
  async send({ subject, html, to }) {
    const mailOptions = {
      from: this.from,
      to,
      subject,
      html,
    };

    await this.transport.sendMail(mailOptions);
  }
}

module.exports = Email;
