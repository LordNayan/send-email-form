const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve the HTML form (optional — if you want to serve the form from Express)
app.get('/', (req, res) => {
  // You can also serve a static file, but here we'll just send a simple string with instructions
  res.sendFile(__dirname + '/form.html');
});
/**
 * POST /send-mail
 * Receives 'description' and 'ticketNumber' from the request body
 * Sends an Outlook email using nodemailer
 */
app.post('/send-mail', async (req, res) => {
    try {
      const { description, ticketNumber } = req.body;
  
      console.log('Received description:', process.env.EMAIL_USER);
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        cc: process.env.EMAIL_CC,
        subject: `Daily Status Report - Nayan Lakhwani [Techdome]`,
        html: `
          <p>Hi Arvind,</p>
          <p>Hope you are doing well!</p>
          <p>Please find the daily status report for ${new Date().toLocaleDateString('en-IN')} regarding my tasks.</p>
          <p><strong>Task Updates:</strong></p>
          <p>${description}</p>
          <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
          <p>Best,<br/>Nayan</p>
        `
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
