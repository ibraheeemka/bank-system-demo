const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*',  // Allow all origins in demo
  methods: ['GET', 'POST'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes first
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Email sending endpoint
app.post('/api/send-account-id', async (req, res) => {
  const { email, accountId, password } = req.body;

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your UNI Bank Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to UNI Bank! 🎉</h2>
          <p>Thank you for creating an account with us. Here are your account credentials:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">Account ID</h3>
            <p style="font-size: 1.2em; margin: 0; color: #1e40af;">${accountId}</p>
            
            <h3 style="color: #1e40af; margin: 20px 0 10px 0;">Password</h3>
            <p style="font-size: 1.2em; margin: 0; color: #1e40af;">${password}</p>
          </div>
          
          <p>You'll need these credentials to sign in to your account. Please keep them safe!</p>
          <p style="color: #6b7280; font-size: 0.9em;">For security reasons, please do not share these credentials with anyone.</p>
          <p style="color: #6b7280; font-size: 0.9em;">We recommend changing your password after your first login.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Account credentials sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 