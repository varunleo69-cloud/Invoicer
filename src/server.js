const express = require('express');
const path = require('path');
const { calculateInvoice } = require('./billing');

const app = express();
app.use(express.json());

// 1. Serve static assets
app.use(express.static(path.join(__dirname, '../public')));

// 2. Explicit Root Route Fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 3. Healthcheck Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 4. Invoicing API
app.post('/api/v1/invoices', (req, res) => {
  try {
    const { items, taxRate } = req.body;
    const invoice = calculateInvoice(items, taxRate);
    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Invoicer live at http://localhost:${PORT}`);
  });
}

module.exports = app;
