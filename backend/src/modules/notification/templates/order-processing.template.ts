import { getBaseTemplate, getStatusBadge } from './base.template';

interface OrderProcessingData {
  customerName: string;
  orderNumber: string;
  message?: string;
  estimatedShipDate?: string;
}

export function orderProcessingTemplate(data: OrderProcessingData): string {
  const content = `
    <div class="content">
      <p class="greeting">Great news, ${data.customerName}! 🎉</p>
      
      <p class="message">
        Your order is now being prepared by our team. We're carefully packaging your premium KOLAQ ALAGBO products to ensure they arrive in perfect condition.
      </p>
      
      <div class="order-box" style="text-align: center;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px;">Order Number</p>
        <p class="order-number">${data.orderNumber}</p>
        <div style="margin-top: 15px;">
          ${getStatusBadge('PROCESSING')}
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%); border-radius: 12px; padding: 30px; margin: 25px 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
        <h3 style="margin: 0 0 10px; color: #3730A3;">We're Preparing Your Order</h3>
        <p style="margin: 0; color: #4338CA; font-size: 14px;">
          Our team is carefully selecting and packaging your items
        </p>
      </div>
      
      ${data.message ? `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #166534;">
            <strong>📝 Note from our team:</strong><br>
            ${data.message}
          </p>
        </div>
      ` : ''}
      
      ${data.estimatedShipDate ? `
        <div class="info-card" style="text-align: center;">
          <p class="info-card-title">Estimated Ship Date</p>
          <p class="info-card-content" style="font-size: 18px; font-weight: 600;">${data.estimatedShipDate}</p>
        </div>
      ` : ''}
      
      <hr class="divider">
      
      <h4 style="color: #1a1a1a; margin-bottom: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Progress</h4>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
        <tr>
          <td width="25%" style="text-align: center; padding: 15px 5px;">
            <div style="width: 40px; height: 40px; background: #4ADE80; border-radius: 50%; margin: 0 auto 10px; line-height: 40px; color: white; font-size: 16px;">✓</div>
            <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase;">Confirmed</p>
          </td>
          <td width="25%" style="text-align: center; padding: 15px 5px;">
            <div style="width: 40px; height: 40px; background: #3730A3; border-radius: 50%; margin: 0 auto 10px; line-height: 40px; color: white; font-size: 16px;">📦</div>
            <p style="margin: 0; font-size: 11px; color: #3730A3; font-weight: 600; text-transform: uppercase;">Processing</p>
          </td>
          <td width="25%" style="text-align: center; padding: 15px 5px;">
            <div style="width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; margin: 0 auto 10px; line-height: 40px; color: #94a3b8; font-size: 16px;">🚚</div>
            <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase;">Shipped</p>
          </td>
          <td width="25%" style="text-align: center; padding: 15px 5px;">
            <div style="width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; margin: 0 auto 10px; line-height: 40px; color: #94a3b8; font-size: 16px;">🎁</div>
            <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase;">Delivered</p>
          </td>
        </tr>
      </table>
      
      <p class="message">
        You'll receive an email with tracking information as soon as your order ships. 
        In the meantime, feel free to track your order status on our website.
      </p>
      
      <div style="text-align: center;">
        <a href="https://kolaqalagbo.org/track?order=${data.orderNumber}" class="cta-button">Track Order Status</a>
      </div>
    </div>
  `;

  return getBaseTemplate(content, `Your order ${data.orderNumber} is being prepared! We'll notify you when it ships.`);
}
