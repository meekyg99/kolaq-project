import { getBaseTemplate } from './base.template';

interface WelcomeEmailData {
  customerName: string;
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  const content = `
    <div class="content">
      <p class="greeting">Welcome to the KOLAQ family, <span class="highlight">${data.customerName}</span>! 🌿</p>
      
      <p class="message">
        Thank you for joining us on a journey to wellness. At KOLAQ ALAGBO, we're dedicated to 
        bringing you the finest premium herbal bitters, crafted from traditional Nigerian recipes 
        passed down through generations.
      </p>

      <p class="message">
        Here's what you can expect as part of our community:
      </p>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div style="margin-bottom: 15px;">
          <span style="color: #4ADE80; font-size: 20px;">✓</span>
          <strong style="margin-left: 10px;">Premium Quality</strong>
          <p style="margin: 5px 0 0 30px; color: #666;">Authentic herbal bitters with no artificial additives</p>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #4ADE80; font-size: 20px;">✓</span>
          <strong style="margin-left: 10px;">Fast Delivery</strong>
          <p style="margin: 5px 0 0 30px; color: #666;">Quick shipping across Nigeria and internationally</p>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #4ADE80; font-size: 20px;">✓</span>
          <strong style="margin-left: 10px;">Exclusive Offers</strong>
          <p style="margin: 5px 0 0 30px; color: #666;">Be the first to know about sales and new products</p>
        </div>
      </div>

      <p class="message">
        Ready to explore our collection? Start your wellness journey today!
      </p>

      <div style="text-align: center;">
        <a href="https://kolaqalagbo.org/shop" class="cta-button">Shop Now</a>
      </div>

      <hr class="divider">

      <p class="message" style="font-size: 14px;">
        Have questions? Our support team is here to help.<br>
        📧 Email us at <a href="mailto:support@kolaqalagbo.org" style="color: #4ADE80;">support@kolaqalagbo.org</a><br>
        📱 WhatsApp: <a href="https://wa.me/2348157065742" style="color: #4ADE80;">+234 815 706 5742</a>
      </p>
    </div>
  `;

  return getBaseTemplate(content, `Welcome to KOLAQ ALAGBO, ${data.customerName}! Start your wellness journey with premium herbal bitters.`);
}
