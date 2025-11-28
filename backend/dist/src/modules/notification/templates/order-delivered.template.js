"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDeliveredTemplate = orderDeliveredTemplate;
const base_template_1 = require("./base.template");
function orderDeliveredTemplate(data) {
    const content = `
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
        <h2 style="color: #1a1a1a; margin: 0;">Order Delivered!</h2>
        <p style="color: #888; margin: 10px 0 0;">Your KOLAQ ALAGBO has arrived</p>
      </div>

      <p class="greeting">Hi <span class="highlight">${data.customerName}</span>,</p>
      
      <p class="message">
        Great news! Your order <strong>#${data.orderNumber}</strong> has been delivered successfully. 
        We hope you enjoy your premium KOLAQ ALAGBO herbal bitters!
      </p>

      <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">🎊</div>
        <p style="margin: 0; color: #2e7d32; font-size: 18px; font-weight: 600;">Thank you for choosing KOLAQ ALAGBO!</p>
        <p style="margin: 10px 0 0; color: #388e3c; font-size: 14px;">Your wellness journey continues with every sip</p>
      </div>

      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px;">How to Get the Most from Your Bitters</h3>
        <div style="margin-bottom: 15px;">
          <span style="color: #4ADE80; font-size: 18px;">🌿</span>
          <span style="margin-left: 10px; color: #555;">Take 1-2 tablespoons daily, preferably before meals</span>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #4ADE80; font-size: 18px;">💧</span>
          <span style="margin-left: 10px; color: #555;">Can be taken neat or diluted with water</span>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #4ADE80; font-size: 18px;">🧊</span>
          <span style="margin-left: 10px; color: #555;">Store in a cool, dry place for best results</span>
        </div>
        <div>
          <span style="color: #4ADE80; font-size: 18px;">⏰</span>
          <span style="margin-left: 10px; color: #555;">Consistency is key - make it part of your routine</span>
        </div>
      </div>

      <div style="background: #fff8e1; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px; color: #f57c00; font-size: 16px; font-weight: 600;">⭐ Love Your Experience?</p>
        <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
          Your feedback helps other customers discover the benefits of KOLAQ ALAGBO
        </p>
        <a href="https://kolaqalagbo.org/reviews" style="display: inline-block; background: #f57c00; color: white !important; padding: 10px 25px; text-decoration: none; border-radius: 20px; font-weight: 600; font-size: 13px;">Leave a Review</a>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #888; font-size: 14px; margin-bottom: 15px;">Ready for more?</p>
        <a href="https://kolaqalagbo.org/shop" class="cta-button">Shop Again</a>
      </div>

      <hr class="divider">

      <p class="message" style="font-size: 14px; text-align: center;">
        Questions or feedback? We'd love to hear from you!<br>
        📧 <a href="mailto:support@kolaqalagbo.org" style="color: #4ADE80;">support@kolaqalagbo.org</a> | 
        📱 <a href="https://wa.me/2348157065742" style="color: #4ADE80;">WhatsApp Us</a>
      </p>
    </div>
  `;
    return (0, base_template_1.getBaseTemplate)(content, `Your KOLAQ ALAGBO order #${data.orderNumber} has been delivered! Enjoy your wellness journey.`);
}
//# sourceMappingURL=order-delivered.template.js.map