const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = ({ to, subject, html }) =>
  transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });

module.exports = { sendEmail };