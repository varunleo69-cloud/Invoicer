const request = require('supertest');
const app = require('../src/server');
const { calculateInvoice } = require('../src/billing');

describe('Billing Logic & API Integration Tests', () => {
  test('Should accurately calculate per-item GST rates and grand total', () => {
    const items = [
      { name: 'Book (Exempt)', price: 500, quantity: 2, taxRate: 0.00 }, // 1000 + 0
      { name: 'Branded Apparel', price: 2000, quantity: 1, taxRate: 0.12 }, // 2000 + 240
      { name: 'Monitor', price: 10000, quantity: 1, taxRate: 0.18 } // 10000 + 1800
    ];
    const result = calculateInvoice(items);
    expect(result.subtotal).toBe(13000);
    expect(result.taxAmount).toBe(2040);
    expect(result.total).toBe(15040);
  });

  test('Should return 200 OK on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('UP');
  });

  test('POST /api/v1/invoices returns 400 on empty items', async () => {
    const res = await request(app)
      .post('/api/v1/invoices')
      .send({ items: [] });
    expect(res.statusCode).toEqual(400);
  });
});
