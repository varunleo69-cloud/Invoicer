const itemsContainer = document.getElementById('items-container');
const addItemBtn = document.getElementById('add-item-btn');
const form = document.getElementById('invoice-form');
const resultCard = document.getElementById('result-card');
const statusBadge = document.getElementById('system-status');

async function checkHealth() {
  try {
    const res = await fetch('/health');
    if (res.ok) {
      statusBadge.textContent = 'API Online';
      statusBadge.className = 'status-badge status-online';
    }
  } catch {
    statusBadge.textContent = 'API Offline';
    statusBadge.style.color = '#ef4444';
  }
}
checkHealth();

function createItemRow(desc = '', price = '', qty = 1) {
  const row = document.createElement('div');
  row.className = 'form-row';
  row.innerHTML = `
    <input type="text" class="col-desc item-name" placeholder="e.g. Cloud Server Hosting" value="${desc}" required />
    <input type="number" class="col-price item-price" placeholder="Price" min="0" step="any" value="${price}" required />
    <input type="number" class="col-qty item-qty" placeholder="Qty" min="1" value="${qty}" required />
    <button type="button" class="btn-danger remove-btn col-action">✕</button>
  `;

  row.querySelector('.remove-btn').addEventListener('click', () => {
    if (itemsContainer.children.length > 1) {
      row.remove();
    }
  });

  itemsContainer.appendChild(row);
}

createItemRow('Web Design & Architecture', 35000, 1);
createItemRow('API Integration Setup', 15000, 1);

addItemBtn.addEventListener('click', () => createItemRow());

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const rows = document.querySelectorAll('#items-container .form-row');
  const items = [];

  rows.forEach((row) => {
    const name = row.querySelector('.item-name').value.trim();
    const price = parseFloat(row.querySelector('.item-price').value);
    const quantity = parseInt(row.querySelector('.item-qty').value, 10);

    if (name && !isNaN(price) && !isNaN(quantity)) {
      items.push({ name, price, quantity });
    }
  });

  const taxRate = parseFloat(document.getElementById('tax-rate').value);

  try {
    const response = await fetch('/api/v1/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, taxRate })
    });

    const data = await response.json();

    if (data.success) {
      const inv = data.invoice;
      document.getElementById('res-items').textContent = inv.itemCount;
      document.getElementById('res-subtotal').textContent = `₹${inv.subtotal.toLocaleString('en-IN')}`;
      document.getElementById('res-tax-rate').textContent = inv.taxRate;
      document.getElementById('res-tax').textContent = `₹${inv.taxAmount.toLocaleString('en-IN')}`;
      document.getElementById('res-total').textContent = `₹${inv.total.toLocaleString('en-IN')}`;

      resultCard.classList.remove('hidden');
      resultCard.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Error: ' + data.error);
    }
  } catch (err) {
    alert('Failed to connect to backend service.');
  }
});
