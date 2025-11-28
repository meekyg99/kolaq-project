import { getBaseTemplate } from './base.template';

interface OrderShippedData {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export function orderShippedTemplate(data: OrderShippedData): string {
  const content = `
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">🚚</div>
        <h2 style="color: #1a1a1a; margin: 0;">Your Order is On Its Way!</h2>
        <p style="color: #888; margin: 10px 0 0;">Exciting news - your order has shipped!</p>
      </div>

      <p class="greeting">Hi <span class="highlight">${data.customerName}</span>,</p>
      
      <p class="message">
        Your order <strong>#${data.orderNumber}</strong> has been shipped and is on its way to you! 
        ${data.estimatedDelivery ? `Expected delivery: <strong>${data.estimatedDelivery}</strong>` : ''}
      </p>

      ${data.trackingNumber ? `
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Tracking Number</p>
        <p style="margin: 0; color: #4ADE80; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${data.trackingNumber}</p>
        ${data.carrier ? `<p style="margin: 10px 0 0; color: #aaa; font-size: 13px;">Carrier: ${data.carrier}</p>` : ''}
      </div>
      ` : ''}

      ${data.trackingUrl ? `
      <div style="text-align: center; margin: 25px 0;">
        <a href="${data.trackingUrl}" class="cta-button">Track Package</a>
      </div>
      ` : ''}

      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px;">Delivery Progress</h3>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <div style="background: #4ADE80; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">✓</div>
          <div style="margin-left: 12px;">
            <strong style="color: #4ADE80;">Order Confirmed</strong>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <div style="background: #4ADE80; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">✓</div>
          <div style="margin-left: 12px;">
            <strong style="color: #4ADE80;">Processing Complete</strong>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <div style="background: #4ADE80; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">3</div>
          <div style="margin-left: 12px;">
            <strong style="color: #1a1a1a;">Shipped</strong> <span style="color: #4ADE80; font-size: 12px;">← Current status</span>
            <p style="margin: 3px 0 0; color: #666; font-size: 13px;">Your package is in transit</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start;">
          <div style="background: #ddd; color: #888; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">4</div>
          <div style="margin-left: 12px;">
            <strong style="color: #888;">Out for Delivery</strong>
            <p style="margin: 3px 0 0; color: #999; font-size: 13px;">Almost there!</p>
          </div>
        </div>
      </div>

      <div style="background: #fff3cd; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
          <strong>📍 Delivery Tips:</strong><br>
          • Ensure someone is available to receive the package<br>
          • Check your phone for delivery updates<br>
          • Contact us if you need to change delivery details
        </p>
      </div>

      <hr class="divider">

      <p class="message" style="font-size: 14px; text-align: center;">
        Questions about your delivery?<br>
        📧 <a href="mailto:support@kolaqalagbo.org" style="color: #4ADE80;">support@kolaqalagbo.org</a> | 
        📱 <a href="https://wa.me/2348157065742" style="color: #4ADE80;">WhatsApp Us</a>
      </p>
    </div>
  `;

  return getBaseTemplate(content, `Your KOLAQ ALAGBO order #${data.orderNumber} has shipped! Track your package now.`);
}
