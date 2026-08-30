const express = require('express');
const { calculateInvoice } = require('./billing');

const app = express();
app.use(express.json());

// Healthcheck Route for Deployment Probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Client Invoice Calculation Endpoint
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
    console.log(`🚀 Client Billing API live on port ${PORT}`);
  });
}

module.exports = app;
