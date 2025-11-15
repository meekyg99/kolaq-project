"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusUpdateTemplate = orderStatusUpdateTemplate;
function orderStatusUpdateTemplate(data) {
    const statusConfig = {
        PAID: {
            color: '#10b981',
            icon: '✓',
            title: 'Payment Confirmed',
        },
        PROCESSING: {
            color: '#3b82f6',
            icon: '⚙',
            title: 'Order Processing',
        },
        SHIPPED: {
            color: '#8b5cf6',
            icon: '📦',
            title: 'Order Shipped',
        },
        DELIVERED: {
            color: '#059669',
            icon: '✓',
            title: 'Order Delivered',
        },
        CANCELLED: {
            color: '#ef4444',
            icon: '✗',
            title: 'Order Cancelled',
        },
    };
    const config = statusConfig[data.status] || {
        color: '#667eea',
        icon: 'ℹ',
        title: 'Order Update',
    };
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - KOLAQ Bitters</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${config.color}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <div style="font-size: 48px; margin-bottom: 10px;">${config.icon}</div>
    <h1 style="color: white; margin: 0; font-size: 28px;">${config.title}</h1>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${data.customerName},</p>
    
    <p>${data.statusMessage}</p>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
      <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: ${config.color};">${data.orderNumber}</p>
    </div>

    ${data.trackingUrl
        ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.trackingUrl}" style="display: inline-block; background: ${config.color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Track Your Order
      </a>
    </div>
    `
        : ''}

    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
      <p>Need help? Contact us at <a href="mailto:support@kolaqbitters.com" style="color: ${config.color};">support@kolaqbitters.com</a></p>
      <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} KOLAQ Bitters. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
//# sourceMappingURL=order-status-update.template.js.map