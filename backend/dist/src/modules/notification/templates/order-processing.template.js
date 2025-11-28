"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProcessingTemplate = orderProcessingTemplate;
const base_template_1 = require("./base.template");
function orderProcessingTemplate(data) {
    const content = `
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">📦</div>
        <h2 style="color: #1a1a1a; margin: 0;">Order Being Processed</h2>
        <p style="color: #888; margin: 10px 0 0;">We're preparing your order!</p>
      </div>

      <p class="greeting">Hi <span class="highlight">${data.customerName}</span>,</p>
      
      <p class="message">
        Great news! Your order <strong>#${data.orderNumber}</strong> is now being processed. 
        Our team is carefully preparing your premium KOLAQ ALAGBO products for shipment.
      </p>

      ${data.message ? `
      <div style="background: #e8f5e9; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #4ADE80; margin: 25px 0;">
        <p style="margin: 0; color: #2e7d32;">
          <strong>Note from our team:</strong><br>
          ${data.message}
        </p>
      </div>
      ` : ''}

      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px;">What happens next?</h3>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <div style="background: #4ADE80; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">✓</div>
          <div style="margin-left: 12px;">
            <strong style="color: #4ADE80;">Order Confirmed</strong>
            <p style="margin: 3px 0 0; color: #666; font-size: 13px;">Payment received and verified</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <div style="background: #4ADE80; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">2</div>
          <div style="margin-left: 12px;">
            <strong style="color: #1a1a1a;">Processing</strong> <span style="color: #4ADE80; font-size: 12px;">← You are here</span>
            <p style="margin: 3px 0 0; color: #666; font-size: 13px;">Packing your products with care</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <div style="background: #ddd; color: #888; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">3</div>
          <div style="margin-left: 12px;">
            <strong style="color: #888;">Shipped</strong>
            <p style="margin: 3px 0 0; color: #999; font-size: 13px;">On its way to you</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start;">
          <div style="background: #ddd; color: #888; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">4</div>
          <div style="margin-left: 12px;">
            <strong style="color: #888;">Delivered</strong>
            <p style="margin: 3px 0 0; color: #999; font-size: 13px;">Enjoy your KOLAQ ALAGBO!</p>
          </div>
        </div>
      </div>

      <p class="message">
        We'll send you another email with tracking information once your order ships. 
        Thank you for your patience!
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://kolaqalagbo.org/track-order?order=${data.orderNumber}" class="cta-button">Track Order</a>
      </div>

      <hr class="divider">

      <p class="message" style="font-size: 14px; text-align: center;">
        Questions? We're here to help!<br>
        📧 <a href="mailto:support@kolaqalagbo.org" style="color: #4ADE80;">support@kolaqalagbo.org</a>
      </p>
    </div>
  `;
    return (0, base_template_1.getBaseTemplate)(content, `Your KOLAQ ALAGBO order #${data.orderNumber} is being processed!`);
}
//# sourceMappingURL=order-processing.template.js.map