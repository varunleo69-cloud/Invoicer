const request = require('supertest');
const app = require('../src/server');
const { calculateInvoice } = require('../src/billing');

describe('Billing Logic & API Integration Tests', () => {
  test('Should accurately calculate subtotal, 18% GST, and total', () => {
    const items = [
      { name: 'Mechanical Keyboard', price: 2000, quantity: 2 },
      { name: 'Type-C Cable', price: 500, quantity: 1 }
    ];
    const result = calculateInvoice(items, 0.18);
    expect(result.subtotal).toBe(4500);
    expect(result.taxAmount).toBe(810);
    expect(result.total).toBe(5310);
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
