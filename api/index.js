const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { description, ticketNumber } = req.body;

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        cc: process.env.EMAIL_CC,
        subject: `Daily Status Report - Nayan Lakhwani [Techdome]`,
        html: `
          <p>Hi Arvind,</p>
          <p>Hope you are doing well!</p>
          <p>Please find the daily status report for ${new Date().toLocaleDateString(
            'en-IN',
            { timeZone: 'Asia/Kolkata' }
          )} regarding my tasks.</p>
          <p><strong>Task Updates:</strong></p>
          <p>${description}</p>
          <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
          <p>Best,<br/>Nayan</p>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};