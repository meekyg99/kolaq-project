import { getBaseTemplate, getStatusBadge, getOrderTimeline } from './base.template';

interface DeliveredEmailData {
  customerName: string;
  orderNumber: string;
  deliveryDate?: Date;
}

export function orderDeliveredTemplate(data: DeliveredEmailData): string {
  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
      <h1 style="color: #1F2937; margin: 0 0 8px 0; font-size: 28px;">Your Order Has Been Delivered!</h1>
      <p style="color: #6B7280; margin: 0; font-size: 16px;">Order #${data.orderNumber}</p>
    </div>

    ${getOrderTimeline(4)}

    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; padding: 32px; margin: 24px 0; text-align: center;">
      ${getStatusBadge('DELIVERED')}
      <h2 style="color: white; margin: 16px 0 8px 0; font-size: 22px;">
        Congratulations, ${data.customerName.split(' ')[0]}! 🌿
      </h2>
      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
        Your authentic African herbal products have arrived safely.
      </p>
    </div>

    <div style="background: #FEF3C7; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="color: #92400E; margin: 0 0 12px 0; font-size: 18px;">⭐ How Was Your Experience?</h3>
      <p style="color: #78350F; margin: 0 0 20px 0; font-size: 14px;">
        Your feedback helps us serve you better and helps other customers make informed decisions.
      </p>
      <a href="https://kolaqalagbo.com/reviews" 
         style="display: inline-block; background: #F59E0B; color: white; padding: 14px 32px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Leave a Review ⭐
      </a>
    </div>

    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #1F2937; margin: 0 0 16px 0; font-size: 16px; text-align: center;">
        📖 Getting the Most from Your Products
      </h3>
      <div style="display: table; width: 100%;">
        <div style="display: table-row;">
          <div style="display: table-cell; padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">📚</div>
            <p style="color: #1F2937; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Read Instructions</p>
            <p style="color: #6B7280; margin: 0; font-size: 12px;">Follow usage guidelines for best results</p>
          </div>
          <div style="display: table-cell; padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">🧊</div>
            <p style="color: #1F2937; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Store Properly</p>
            <p style="color: #6B7280; margin: 0; font-size: 12px;">Keep in cool, dry place</p>
          </div>
          <div style="display: table-cell; padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">📱</div>
            <p style="color: #1F2937; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Reach Out</p>
            <p style="color: #6B7280; margin: 0; font-size: 12px;">Contact us for any questions</p>
          </div>
        </div>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #1F2937 0%, #374151 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 8px 0; font-size: 18px;">Ready for More?</h3>
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 16px 0; font-size: 14px;">
        Discover more authentic African herbal products
      </p>
      <a href="https://kolaqalagbo.com/products" 
         style="display: inline-block; background: #10B981; color: white; padding: 14px 32px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Shop Now →
      </a>
    </div>

    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E5E7EB; margin-top: 24px;">
      <p style="color: #6B7280; margin: 0; font-size: 14px;">
        Thank you for choosing <strong style="color: #1F2937;">KOLAQ ALAGBO</strong>.<br>
        We appreciate your trust in our authentic African herbal products.
      </p>
    </div>
  `;

  return getBaseTemplate(content, `Your order #${data.orderNumber} has been delivered!`);
}
