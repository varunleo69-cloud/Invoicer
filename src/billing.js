function calculateInvoice(items, taxRate = 0.18) {
  if (!items || items.length === 0) {
    throw new Error("Invoice must contain at least one item.");
  }

  const subtotal = items.reduce((acc, item) => {
    if (item.price < 0 || item.quantity <= 0) {
      throw new Error("Invalid item price or quantity.");
    }
    return acc + item.price * item.quantity;
  }, 0);

  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    itemCount: items.length,
    subtotal,
    taxAmount,
    taxRate: `${taxRate * 100}%`,
    total
  };
}

module.exports = { calculateInvoice };
