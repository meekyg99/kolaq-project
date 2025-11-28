"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterTemplate = newsletterTemplate;
exports.promotionalTemplate = promotionalTemplate;
const base_template_1 = require("./base.template");
function newsletterTemplate(data) {
    const greeting = data.recipientName
        ? `Hi <span class="highlight">${data.recipientName}</span>,`
        : 'Hello,';
    const ctaSection = data.ctaText && data.ctaUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.ctaUrl}" class="cta-button">${data.ctaText}</a>
    </div>
  ` : '';
    const content = `
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; line-height: 1.3;">${data.headline}</h1>
      </div>

      <p class="greeting">${greeting}</p>
      
      <div class="message" style="white-space: pre-line; line-height: 1.8;">
        ${data.content}
      </div>

      ${ctaSection}

      <hr class="divider">

      <div style="text-align: center; margin: 25px 0;">
        <p style="color: #888; font-size: 14px; margin-bottom: 15px;">Connect with us:</p>
        <div>
          <a href="https://instagram.com/kolaqalagbo" style="margin: 0 10px; color: #4ADE80;">Instagram</a>
          <a href="https://facebook.com/kolaqalagbo" style="margin: 0 10px; color: #4ADE80;">Facebook</a>
          <a href="https://twitter.com/kolaqalagbo" style="margin: 0 10px; color: #4ADE80;">Twitter</a>
        </div>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #888; font-size: 13px;">
          You're receiving this email because you subscribed to KOLAQ ALAGBO updates.<br>
          <a href="${data.unsubscribeUrl}" style="color: #999;">Unsubscribe</a> | 
          <a href="https://kolaqalagbo.org/preferences" style="color: #999;">Manage Preferences</a>
        </p>
      </div>
    </div>
  `;
    return (0, base_template_1.getBaseTemplate)(content, data.subject);
}
function promotionalTemplate(data) {
    const greeting = data.recipientName
        ? `Hi <span class="highlight">${data.recipientName}</span>,`
        : 'Hello,';
    const discountSection = data.discountCode ? `
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 5px; color: #4ADE80; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Exclusive Code</p>
      <div style="background: white; display: inline-block; padding: 15px 40px; border-radius: 8px; margin: 15px 0;">
        <span style="font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #1a1a1a;">${data.discountCode}</span>
      </div>
      ${data.discountPercent ? `
        <p style="margin: 10px 0 0; color: white; font-size: 24px; font-weight: 700;">${data.discountPercent}% OFF</p>
      ` : ''}
      ${data.expiryDate ? `
        <p style="margin: 10px 0 0; color: #888; font-size: 13px;">Valid until ${data.expiryDate}</p>
      ` : ''}
    </div>
  ` : '';
    const productImage = data.productImageUrl ? `
    <div style="text-align: center; margin: 20px 0;">
      <img src="${data.productImageUrl}" alt="KOLAQ ALAGBO" style="max-width: 100%; height: auto; border-radius: 12px;">
    </div>
  ` : '';
    const content = `
    <div class="content">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
        <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; line-height: 1.3;">${data.promoTitle}</h1>
      </div>

      ${productImage}

      <p class="greeting">${greeting}</p>
      
      <p class="message">
        ${data.promoDescription}
      </p>

      ${discountSection}

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.ctaUrl}" class="cta-button">${data.ctaText}</a>
      </div>

      <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h4 style="margin: 0 0 15px; color: #2e7d32;">Why Choose KOLAQ ALAGBO?</h4>
        <div style="display: grid; gap: 10px;">
          <div style="color: #555;">✓ 100% Natural Herbal Bitters</div>
          <div style="color: #555;">✓ Traditional Recipe, Modern Quality</div>
          <div style="color: #555;">✓ Supports Overall Wellness</div>
          <div style="color: #555;">✓ Fast Nationwide Delivery</div>
        </div>
      </div>

      <hr class="divider">

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #888; font-size: 13px;">
          You're receiving this email because you subscribed to KOLAQ ALAGBO promotions.<br>
          <a href="${data.unsubscribeUrl}" style="color: #999;">Unsubscribe</a> | 
          <a href="https://kolaqalagbo.org/preferences" style="color: #999;">Manage Preferences</a>
        </p>
      </div>
    </div>
  `;
    return (0, base_template_1.getBaseTemplate)(content, data.promoTitle);
}
//# sourceMappingURL=newsletter.template.js.map