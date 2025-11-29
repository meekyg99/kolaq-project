import { getBaseTemplate, formatCurrency, formatDate, getStatusBadge } from './base.template';

export function orderConfirmationTemplate(data: {
  customerName: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  shippingAddress: string;
  orderDate?: Date;
}) {
  const curr = data.currency === 'NGN' ? 'NGN' : 'USD';
  
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
        <span class="product-name">${item.name}</span>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: center;" class="product-qty">
        ×${item.quantity}
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right;" class="product-price">
        ${formatCurrency(item.price * item.quantity, curr)}
      </td>
    </tr>
  `).join('');

  const content = `
    <div class="content">
      <p class="greeting">Thank you for your order, ${data.customerName}! 🎉</p>
      
      <p class="message">
        We're thrilled to have you as a customer! Your order has been received and is being prepared with care. 
        You'll receive another email once your order ships.
      </p>
      
      <div class="order-box">
        <p class="order-number">${data.orderNumber}</p>
        <p class="order-date">${formatDate(data.orderDate || new Date())}</p>
        <div style="margin-top: 15px;">
          ${getStatusBadge('PAID')}
        </div>
      </div>
      
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 15px;">Order Items</h3>
      
      <table class="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div class="totals-box">
        <div class="totals-row">
          <span class="totals-label">Subtotal</span>
          <span class="totals-value">${formatCurrency(data.subtotal, curr)}</span>
        </div>
        <div class="totals-row">
          <span class="totals-label">Shipping</span>
          <span class="totals-value">${data.shippingCost > 0 ? formatCurrency(data.shippingCost, curr) : 'FREE'}</span>
        </div>
        <div class="totals-row">
          <span class="totals-label" style="font-weight: 600; color: #fff;">Total</span>
          <span class="totals-value grand-total">${formatCurrency(data.total, curr)}</span>
        </div>
      </div>
      
      <div class="info-card">
        <p class="info-card-title">Shipping Address</p>
        <p class="info-card-content" style="white-space: pre-line;">${data.shippingAddress}</p>
      </div>
      
      <hr class="divider">
      
      <div style="text-align: center;">
        <p class="message">You can track your order anytime using your order number.</p>
        <a href="https://kolaqalagbo.org/track?order=${data.orderNumber}" class="cta-button">Track Your Order</a>
      </div>
      
      <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-top: 25px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>📦 What's Next?</strong><br>
          We'll prepare your order and ship it within 1-2 business days. You'll receive tracking information once your order is on its way!
        </p>
      </div>
    </div>
  `;

  return getBaseTemplate(content, `Order ${data.orderNumber} confirmed! We're preparing your premium KOLAQ ALAGBO products.`);
}
