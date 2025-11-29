import { getBaseTemplate } from './base.template';

interface WelcomeEmailData {
  customerName: string;
  discountCode?: string;
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 64px; margin-bottom: 16px;">🌿</div>
      <h1 style="color: #1F2937; margin: 0 0 8px 0; font-size: 28px;">Welcome to the Family!</h1>
      <p style="color: #6B7280; margin: 0; font-size: 16px;">We're so glad you're here, ${data.customerName.split(' ')[0]}!</p>
    </div>

    <div style="background: linear-gradient(135deg, #1F2937 0%, #374151 100%); border-radius: 12px; padding: 32px; margin: 24px 0; text-align: center;">
      <h2 style="color: #4ADE80; margin: 0 0 12px 0; font-size: 22px;">KOLAQ ALAGBO</h2>
      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; line-height: 1.6;">
        Your journey to wellness begins here. We're dedicated to bringing you the finest 
        authentic African herbal products, crafted from traditional recipes passed down through generations.
      </p>
    </div>

    ${data.discountCode ? `
    <div style="background: #FEF3C7; border: 2px dashed #F59E0B; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="color: #92400E; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">🎁 WELCOME GIFT</p>
      <p style="color: #1F2937; margin: 0 0 12px 0; font-size: 24px; font-weight: 700;">10% OFF Your First Order</p>
      <div style="background: white; border-radius: 8px; padding: 12px 24px; display: inline-block;">
        <code style="font-size: 20px; font-weight: 700; color: #10B981; letter-spacing: 2px;">${data.discountCode}</code>
      </div>
      <p style="color: #78350F; margin: 12px 0 0 0; font-size: 12px;">Use at checkout • Valid for 30 days</p>
    </div>
    ` : ''}

    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #1F2937; margin: 0 0 20px 0; font-size: 18px; text-align: center;">
        Why Choose KOLAQ ALAGBO?
      </h3>
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 16px; vertical-align: top;">
            <div style="background: #10B981; width: 48px; height: 48px; border-radius: 50%; text-align: center; line-height: 48px; font-size: 24px; margin: 0 auto 12px;">🌱</div>
            <h4 style="color: #1F2937; margin: 0 0 8px 0; font-size: 14px; text-align: center;">100% Natural</h4>
            <p style="color: #6B7280; margin: 0; font-size: 12px; text-align: center;">Pure ingredients, no artificial additives</p>
          </td>
          <td style="padding: 16px; vertical-align: top;">
            <div style="background: #10B981; width: 48px; height: 48px; border-radius: 50%; text-align: center; line-height: 48px; font-size: 24px; margin: 0 auto 12px;">🏆</div>
            <h4 style="color: #1F2937; margin: 0 0 8px 0; font-size: 14px; text-align: center;">Premium Quality</h4>
            <p style="color: #6B7280; margin: 0; font-size: 12px; text-align: center;">Carefully sourced and crafted</p>
          </td>
          <td style="padding: 16px; vertical-align: top;">
            <div style="background: #10B981; width: 48px; height: 48px; border-radius: 50%; text-align: center; line-height: 48px; font-size: 24px; margin: 0 auto 12px;">🚚</div>
            <h4 style="color: #1F2937; margin: 0 0 8px 0; font-size: 14px; text-align: center;">Fast Delivery</h4>
            <p style="color: #6B7280; margin: 0; font-size: 12px; text-align: center;">Worldwide shipping available</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://kolaqalagbo.com/products" 
         style="display: inline-block; background: #10B981; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Start Shopping →
      </a>
    </div>

    <div style="background: #F0FDF4; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #166534; margin: 0 0 16px 0; font-size: 16px; text-align: center;">
        📱 Connect With Us
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center; padding: 8px;">
            <a href="mailto:support@kolaqalagbo.com" style="color: #166534; text-decoration: none; font-size: 14px;">
              📧 support@kolaqalagbo.com
            </a>
          </td>
          <td style="text-align: center; padding: 8px;">
            <a href="https://wa.me/2348157065742" style="color: #166534; text-decoration: none; font-size: 14px;">
              💬 WhatsApp Support
            </a>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E5E7EB; margin-top: 24px;">
      <p style="color: #6B7280; margin: 0; font-size: 14px;">
        Welcome to authentic African wellness.<br>
        <strong style="color: #1F2937;">KOLAQ ALAGBO</strong> – Nature's gift to you.
      </p>
    </div>
  `;

  return getBaseTemplate(content, `Welcome to KOLAQ ALAGBO, ${data.customerName}! Start your wellness journey.`);
}
