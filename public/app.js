const itemsContainer = document.getElementById('items-container');
const addItemBtn = document.getElementById('add-item-btn');
const form = document.getElementById('invoice-form');
const resultCard = document.getElementById('result-card');
const statusBadge = document.getElementById('system-status');
const breakdownBody = document.getElementById('invoice-breakdown-body');

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

function createItemRow(desc = '', price = '', qty = 1, taxRate = '0.18') {
  const row = document.createElement('div');
  row.className = 'form-row';
  row.innerHTML = `
    <input type="text" class="col-desc item-name" placeholder="Item Name" value="${desc}" required />
    <input type="number" class="col-price item-price" placeholder="Price" min="0" step="any" value="${price}" required />
    <input type="number" class="col-qty item-qty" placeholder="Qty" min="1" value="${qty}" required />
    <select class="col-gst item-tax">
      <option value="0.00" ${taxRate === '0.00' ? 'selected' : ''}>0% (Exempt)</option>
      <option value="0.05" ${taxRate === '0.05' ? 'selected' : ''}>5% GST</option>
      <option value="0.12" ${taxRate === '0.12' ? 'selected' : ''}>12% GST</option>
      <option value="0.18" ${taxRate === '0.18' ? 'selected' : ''}>18% GST</option>
      <option value="0.28" ${taxRate === '0.28' ? 'selected' : ''}>28% GST</option>
    </select>
    <button type="button" class="btn-danger remove-btn col-action">✕</button>
  `;

  row.querySelector('.remove-btn').addEventListener('click', () => {
    if (itemsContainer.children.length > 1) {
      row.remove();
    }
  });

  itemsContainer.appendChild(row);
}

// Initial default rows
createItemRow('Cloud Server Hosting', 4500, 1, '0.18');
createItemRow('Technical Documentation (Print)', 800, 2, '0.05');

addItemBtn.addEventListener('click', () => createItemRow());

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const rows = document.querySelectorAll('#items-container .form-row');
  const items = [];

  rows.forEach((row) => {
    const name = row.querySelector('.item-name').value.trim();
    const price = parseFloat(row.querySelector('.item-price').value);
    const quantity = parseInt(row.querySelector('.item-qty').value, 10);
    const taxRate = parseFloat(row.querySelector('.item-tax').value);

    if (name && !isNaN(price) && !isNaN(quantity)) {
      items.push({ name, price, quantity, taxRate });
    }
  });

  try {
    const response = await fetch('/api/v1/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    const data = await response.json();

    if (data.success) {
      const inv = data.invoice;
      breakdownBody.innerHTML = '';

      inv.items.forEach((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toLocaleString('en-IN')}</td>
          <td>${item.taxRate}</td>
          <td>₹${item.itemTax.toLocaleString('en-IN')}</td>
          <td>₹${item.itemTotal.toLocaleString('en-IN')}</td>
        `;
        breakdownBody.appendChild(tr);
      });

      document.getElementById('res-items').textContent = inv.itemCount;
      document.getElementById('res-subtotal').textContent = `₹${inv.subtotal.toLocaleString('en-IN')}`;
      document.getElementById('res-tax').textContent = `₹${inv.taxAmount.toLocaleString('en-IN')}`;
      document.getElementById('res-total').textContent = `₹${inv.total.toLocaleString('en-IN')}`;

      resultCard.classList.remove('hidden');
      resultCard.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Error: ' + data.error);
    }
  } catch {
    alert('Failed to connect to backend service.');
  }
});
