function calculateInvoice(items, fallbackTaxRate = 0.18) {
  if (!items || items.length === 0) {
    throw new Error("Invoice must contain at least one item.");
  }

  let subtotal = 0;
  let totalTax = 0;

  const itemBreakdown = items.map((item) => {
    if (item.price < 0 || item.quantity <= 0) {
      throw new Error("Invalid item price or quantity.");
    }

    const rate = item.taxRate !== undefined ? parseFloat(item.taxRate) : fallbackTaxRate;
    const itemSubtotal = item.price * item.quantity;
    const itemTax = Math.round(itemSubtotal * rate * 100) / 100;
    const itemTotal = Math.round((itemSubtotal + itemTax) * 100) / 100;

    subtotal += itemSubtotal;
    totalTax += itemTax;

    return {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      taxRate: `${Math.round(rate * 100)}%`,
      itemSubtotal,
      itemTax,
      itemTotal
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  totalTax = Math.round(totalTax * 100) / 100;
  const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

  return {
    itemCount: items.length,
    items: itemBreakdown,
    subtotal,
    taxAmount: totalTax,
    total: grandTotal
  };
}

module.exports = { calculateInvoice };
