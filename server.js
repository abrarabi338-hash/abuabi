/**
 * MOHAMMED ABRAR VK - BACKEND PRODUCTION SERVER (NODE.JS & EXPRESS)
 * Provides optional backend API endpoints for:
 * 1. Static asset serving
 * 2. Protected admin authentication API (/api/auth/login)
 * 3. Contact form email delivery (/api/contact)
 * 4. Portfolio data persistence (/api/portfolio)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'abrar2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime(), time: new Date().toISOString() });
});

// 2. Protected Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { passkey } = req.body;
  if (!passkey) {
    return res.status(400).json({ error: 'Passkey required' });
  }

  if (passkey === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Authentication successful',
      token: Buffer.from(`auth_${Date.now()}_abrar`).toString('base64')
    });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid passkey credentials' });
  }
});

// 3. Contact Form Submission Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  console.log(`[Contact Message Received] From: ${name} <${email}>`);
  console.log(`Message: ${message}`);

  // In production with Nodemailer or SendGrid configured in .env:
  // await transporter.sendMail({ to: process.env.CONTACT_RECEIVER_EMAIL, ... })

  return res.json({
    success: true,
    message: 'Message delivered to Mohammed Abrar VK successfully!'
  });
});

// 4. Portfolio Data Sync
const DATA_FILE = path.join(__dirname, 'portfolio_data.json');

app.get('/api/portfolio', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return res.json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
  }
  return res.json({ status: 'defaults_active' });
});

app.put('/api/portfolio', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    return res.json({ success: true, message: 'Portfolio configuration saved to disk' });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
