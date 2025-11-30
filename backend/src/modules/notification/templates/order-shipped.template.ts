import { getBaseTemplate, getStatusBadge, getOrderTimeline, formatDate } from './base.template';

interface ShippedEmailData {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

export function orderShippedTemplate(data: ShippedEmailData): string {
  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
      <h1 style="color: #1F2937; margin: 0 0 8px 0; font-size: 28px;">Your Order is On Its Way!</h1>
      <p style="color: #6B7280; margin: 0; font-size: 16px;">Order #${data.orderNumber}</p>
    </div>

    ${getOrderTimeline(3)}

    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      ${getStatusBadge('SHIPPED')}
      <p style="color: white; margin: 16px 0 0 0; font-size: 16px;">
        Great news, ${data.customerName.split(' ')[0]}! Your order has been shipped and is on its way to you.
      </p>
    </div>

    ${data.trackingNumber ? `
    <div style="background: #F9FAFB; border: 2px dashed #D1D5DB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h2 style="color: #1F2937; margin: 0 0 16px 0; font-size: 18px; text-align: center;">
        📍 Track Your Package
      </h2>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
        ${data.carrier ? `
        <tr>
          <td style="padding: 8px 0; color: #6B7280;">Carrier:</td>
          <td style="padding: 8px 0; color: #1F2937; font-weight: 600; text-align: right;">${data.carrier}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #6B7280;">Tracking Number:</td>
          <td style="padding: 8px 0; color: #1F2937; font-weight: 600; text-align: right; font-family: monospace;">${data.trackingNumber}</td>
        </tr>
        ${data.estimatedDelivery ? `
        <tr>
          <td style="padding: 8px 0; color: #6B7280;">Estimated Delivery:</td>
          <td style="padding: 8px 0; color: #10B981; font-weight: 600; text-align: right;">${formatDate(data.estimatedDelivery)}</td>
        </tr>
        ` : ''}
      </table>

      ${data.trackingUrl ? `
      <div style="text-align: center;">
        <a href="${data.trackingUrl}" 
           style="display: inline-block; background: #1F2937; color: white; padding: 14px 32px; 
                  text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Track Your Package →
        </a>
      </div>
      ` : ''}
    </div>
    ` : ''}

    ${data.shippingAddress ? `
    <div style="background: #FFF7ED; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #9A3412; margin: 0 0 12px 0; font-size: 16px;">🏠 Shipping To:</h3>
      <p style="color: #1F2937; margin: 0; line-height: 1.6;">
        <strong>${data.customerName}</strong><br>
        ${data.shippingAddress.street}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.state}<br>
        ${data.shippingAddress.country}
      </p>
    </div>
    ` : ''}

    <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 14px;">💡 Delivery Tips</h3>
      <ul style="color: #166534; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
        <li>Ensure someone is available to receive the package</li>
        <li>Check the tracking link for real-time updates</li>
        <li>Contact us immediately if there are any delivery issues</li>
      </ul>
    </div>

    <div style="text-align: center; padding: 24px 0;">
      <p style="color: #6B7280; margin: 0 0 16px 0; font-size: 14px;">
        Questions about your shipment? We're here to help!
      </p>
      <a href="mailto:support@kolaqalagbo.com" 
         style="color: #10B981; text-decoration: none; font-weight: 600;">
        Contact Support →
      </a>
    </div>
  `;

  return getBaseTemplate(content, `Your order #${data.orderNumber} has been shipped!`);
}
