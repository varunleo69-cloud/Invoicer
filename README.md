# Invoicer — Client Billing & Multi-Tier GST Portal (CI/CD Automated)

A lightweight, production-ready invoice generation micro-app and calculation API built with Node.js and Express. Features automated end-to-end CI/CD delivery using Jenkins, Jest testing suites, and Docker containerization.

---

## 📌 Architecture Overview

[ Git Push ] ──► [ GitHub Webhook ] ──► [ Jenkins CI/CD Pipeline ]
│
┌──────────────────────────────┼──────────────────────────────┐
▼                              ▼                              ▼
Stage 1: Unit Tests            Stage 2: Containerize           Stage 3: Auto Deploy
(Jest & Supertest API)           (Docker Build & Tag)           (Docker Run on :3000)
│
▼
[ Health Smoke Test ]


---

## 🚀 Key Features

* **Interactive Frontend UI:** Dynamic row generation, real-time GST tax slab selection (0%, 5%, 12%, 18%, 28%), itemized calculation tables, and print-to-PDF ready styling.
* **REST API Endpoints:** Clean endpoints for health probes (`/health`) and structured JSON invoice processing (`/api/v1/invoices`).
* **Automated CI/CD Pipeline:** Jenkins declarative pipeline triggers on push via GitHub webhooks.
* **Automated Quality Gate:** Jest unit tests enforce billing accuracy and data validation before deployment.
* **Zero-Downtime Container Rebuilds:** Docker handles isolated packaging and automatic container restarts.

---

## 🛠️ Tech Stack

* **Backend / Runtime:** Node.js, Express.js
* **Testing:** Jest, Supertest
* **Frontend:** Vanilla JS, CSS3, HTML5 (Semantic & Responsive)
* **DevOps / CI/CD:** Jenkins, Docker, Linux (Ubuntu/Debian)
* **Networking / Tunnels:** Localtunnel / Cloudflare Tunnels (Zero Trust)

---

## 📋 CI/CD Pipeline Stages (`Jenkinsfile`)

1. **SCM Checkout:** Pulls latest branch changes via Git.
2. **Install & Test:** Executes `npm install` and runs `npm test` (Jest test suite).
3. **Build Docker Image:** Packages the application and UI into `invoicer:latest`.
4. **Deploy Application:** Stops the previous container instance and deploys the new build to port `3000`.
5. **Smoke Test Deployment:** Probes the live application's `/health` endpoint to verify successful startup.

---

## 💻 Local Setup & Development

### 1. Clone & Install

git clone [https://github.com/varunleo69-cloud/Invoicer.git](https://github.com/varunleo69-cloud/Invoicer.git)
cd Invoicer
npm install

### 2. Run Tests

npm test

### 3. Start Local Server

npm start
# App live at http://localhost:3000

## 🐳 Docker Deployment
Manual Docker Build & Run

# Build image
docker build -t invoicer:latest .

# Run container
docker run -d --name invoicer -p 3000:3000 invoicer:latest

## 🔌 API Reference

Healthcheck
GET /health

{
  "status": "UP",
  "timestamp": "2026-08-30T05:00:00.000Z"
}

Create Invoice
POST /api/v1/invoices

Request Body:

{
  "items": [
    { "name": "Cloud Server Hosting", "price": 4500, "quantity": 1, "taxRate": 0.18 },
    { "name": "Documentation Printout", "price": 800, "quantity": 2, "taxRate": 0.05 }
  ]
}

Response (201 Created):

{
  "success": true,
  "invoice": {
    "itemCount": 2,
    "items": [
      {
        "name": "Cloud Server Hosting",
        "price": 4500,
        "quantity": 1,
        "taxRate": "18%",
        "itemSubtotal": 4500,
        "itemTax": 810,
        "itemTotal": 5310
      },
      {
        "name": "Documentation Printout",
        "price": 800,
        "quantity": 2,
        "taxRate": "5%",
        "itemSubtotal": 1600,
        "itemTax": 80,
        "itemTotal": 1680
      }
    ],
    "subtotal": 6100,
    "taxAmount": 890,
    "total": 6990
  }
}
👤 Author
Varun
