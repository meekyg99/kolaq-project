import { getBaseTemplate } from './base.template';

interface NewsletterData {
  recipientName?: string;
  subject: string;
  headline: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  unsubscribeUrl: string;
}

export function newsletterTemplate(data: NewsletterData): string {
  const greeting = data.recipientName 
    ? data.recipientName.split(' ')[0]
    : 'there';

  const ctaSection = data.ctaText && data.ctaUrl ? `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.ctaUrl}" 
         style="display: inline-block; background: #10B981; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        ${data.ctaText}
      </a>
    </div>
  ` : '';

  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <h1 style="color: #1F2937; margin: 0 0 16px 0; font-size: 28px; line-height: 1.4;">${data.headline}</h1>
    </div>

    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="color: #1F2937; margin: 0 0 16px 0; font-size: 16px;">Hi ${greeting}! 👋</p>
      <div style="color: #374151; font-size: 15px; line-height: 1.8; white-space: pre-line;">
        ${data.content}
      </div>
    </div>

    ${ctaSection}

    <div style="background: #F0FDF4; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="color: #166534; margin: 0 0 12px 0; font-size: 14px;">Follow us for updates and wellness tips</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center; padding: 8px;">
            <a href="https://instagram.com/kolaqalagbo" style="color: #10B981; text-decoration: none; font-weight: 600;">📸 Instagram</a>
          </td>
          <td style="text-align: center; padding: 8px;">
            <a href="https://facebook.com/kolaqalagbo" style="color: #10B981; text-decoration: none; font-weight: 600;">📘 Facebook</a>
          </td>
          <td style="text-align: center; padding: 8px;">
            <a href="https://twitter.com/kolaqalagbo" style="color: #10B981; text-decoration: none; font-weight: 600;">🐦 Twitter</a>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E5E7EB; margin-top: 24px;">
      <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
        You're receiving this because you subscribed to KOLAQ ALAGBO updates.<br>
        <a href="${data.unsubscribeUrl}" style="color: #6B7280; text-decoration: underline;">Unsubscribe</a> · 
        <a href="https://kolaqalagbo.com/preferences" style="color: #6B7280; text-decoration: underline;">Manage Preferences</a>
      </p>
    </div>
  `;

  return getBaseTemplate(content, data.subject);
}

interface PromotionalData {
  recipientName?: string;
  promoTitle: string;
  promoDescription: string;
  discountCode?: string;
  discountPercent?: number;
  expiryDate?: string;
  productImageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  unsubscribeUrl: string;
}

export function promotionalTemplate(data: PromotionalData): string {
  const greeting = data.recipientName 
    ? data.recipientName.split(' ')[0]
    : 'there';

  const discountSection = data.discountCode ? `
    <div style="background: linear-gradient(135deg, #1F2937 0%, #374151 100%); padding: 32px; border-radius: 12px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px; color: #4ADE80; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
        Your Exclusive Code
      </p>
      <div style="background: white; display: inline-block; padding: 16px 32px; border-radius: 8px; margin: 16px 0;">
        <code style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #1F2937;">${data.discountCode}</code>
      </div>
      ${data.discountPercent ? `
        <p style="margin: 12px 0 0; color: white; font-size: 28px; font-weight: 700;">${data.discountPercent}% OFF</p>
      ` : ''}
      ${data.expiryDate ? `
        <p style="margin: 12px 0 0; color: #9CA3AF; font-size: 13px;">Valid until ${data.expiryDate}</p>
      ` : ''}
    </div>
  ` : '';

  const productImage = data.productImageUrl ? `
    <div style="text-align: center; margin: 24px 0;">
      <img src="${data.productImageUrl}" alt="KOLAQ ALAGBO Product" style="max-width: 100%; height: auto; border-radius: 12px;">
    </div>
  ` : '';

  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
      <h1 style="color: #1F2937; margin: 0; font-size: 28px; line-height: 1.4;">${data.promoTitle}</h1>
    </div>

    ${productImage}

    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="color: #1F2937; margin: 0 0 16px 0; font-size: 16px;">Hi ${greeting}! 👋</p>
      <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.8;">
        ${data.promoDescription}
      </p>
    </div>

    ${discountSection}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.ctaUrl}" 
         style="display: inline-block; background: #10B981; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        ${data.ctaText} →
      </a>
    </div>

    <div style="background: #F0FDF4; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h4 style="margin: 0 0 16px; color: #166534; font-size: 16px; text-align: center;">Why Choose KOLAQ ALAGBO?</h4>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #166534; font-size: 14px;">✓ 100% Natural Herbal Products</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #166534; font-size: 14px;">✓ Traditional Recipe, Modern Quality</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #166534; font-size: 14px;">✓ Supports Overall Wellness</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #166534; font-size: 14px;">✓ Fast Worldwide Delivery</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E5E7EB; margin-top: 24px;">
      <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
        You're receiving this because you subscribed to KOLAQ ALAGBO promotions.<br>
        <a href="${data.unsubscribeUrl}" style="color: #6B7280; text-decoration: underline;">Unsubscribe</a> · 
        <a href="https://kolaqalagbo.com/preferences" style="color: #6B7280; text-decoration: underline;">Manage Preferences</a>
      </p>
    </div>
  `;

  return getBaseTemplate(content, data.promoTitle);
}
