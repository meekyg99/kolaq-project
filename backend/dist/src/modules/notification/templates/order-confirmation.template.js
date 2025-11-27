"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderConfirmationTemplate = orderConfirmationTemplate;
function orderConfirmationTemplate(data) {
    const itemsList = data.items
        .map((item) => `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${data.currency} ${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${data.currency} ${(item.quantity * item.price).toFixed(2)}</td>
        </tr>`)
        .join('');
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - KOLAQ ALAGBO</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for your order</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${data.customerName},</p>
    
    <p>Thank you for your order! We're preparing your premium KOLAQ ALAGBO products and will notify you when they ship.</p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
      <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #1a1a2e;">${data.orderNumber}</p>
    </div>

    <h2 style="border-bottom: 2px solid #1a1a2e; padding-bottom: 10px; margin-top: 30px;">Order Details</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
          <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>

    <div style="text-align: right; margin-top: 20px;">
      <p style="margin: 5px 0;">Subtotal: <strong>${data.currency} ${data.subtotal.toFixed(2)}</strong></p>
      <p style="margin: 5px 0;">Shipping: <strong>${data.currency} ${data.shippingCost.toFixed(2)}</strong></p>
      <p style="margin: 15px 0 0 0; font-size: 18px; padding-top: 10px; border-top: 2px solid #1a1a2e;">
        Total: <strong style="color: #1a1a2e;">${data.currency} ${data.total.toFixed(2)}</strong>
      </p>
    </div>

    <h3 style="margin-top: 30px;">Shipping Address</h3>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
      <p style="margin: 0; white-space: pre-line;">${data.shippingAddress}</p>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #f0f4f8; border-left: 4px solid #1a1a2e; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold;">Track Your Order</p>
      <p style="margin: 5px 0 0 0;">You can track your order status using order number: <strong>${data.orderNumber}</strong></p>
    </div>

    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
      <p>Need help? Contact us at <a href="mailto:support@kolaqalagbo.org" style="color: #1a1a2e;">support@kolaqalagbo.org</a></p>
      <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} KOLAQ ALAGBO. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
//# sourceMappingURL=order-confirmation.template.js.map