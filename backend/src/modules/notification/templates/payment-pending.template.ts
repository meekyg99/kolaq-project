import { getBaseTemplate, formatCurrency, formatDate } from './base.template';

export function paymentPendingTemplate(data: {
  customerName: string;
  orderNumber: string;
  total: number;
  currency: string;
  orderDate?: Date;
  paymentDeadline?: Date;
}) {
  const curr = data.currency === 'NGN' ? 'NGN' : 'USD';
  const deadline = data.paymentDeadline || new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const content = `
    <div class="content">
      <p class="greeting">Hello ${data.customerName},</p>
      
      <p class="message">
        Thank you for placing your order! Your order <strong>${data.orderNumber}</strong> has been created and is awaiting payment confirmation.
      </p>
      
      <div class="order-box">
        <p class="order-number">${data.orderNumber}</p>
        <p class="order-date">${formatDate(data.orderDate || new Date())}</p>
        <div style="margin-top: 15px;">
          <span style="display: inline-block; padding: 8px 16px; background: #fef3c7; color: #92400e; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            ⏳ Awaiting Payment
          </span>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #1a4d2e 0%, #2d6a4f 100%); border-radius: 12px; padding: 25px; margin: 30px 0; color: white;">
        <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Amount to Pay</p>
        <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -1px;">${formatCurrency(data.total, curr)}</p>
        <p style="margin: 15px 0 0 0; font-size: 13px; opacity: 0.8;">Payment deadline: ${formatDate(deadline)}</p>
      </div>
      
      ${curr === 'NGN' ? `
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 30px 0 15px 0;">Nigerian Bank Transfer Details</h3>
      
      <div class="info-card" style="background: #f8fafc; border: 2px solid #1a4d2e;">
        <table style="width: 100%; font-size: 14px; line-height: 2;">
          <tr>
            <td style="color: #64748b; padding: 8px 0;">Bank Name:</td>
            <td style="color: #1e293b; font-weight: 600; text-align: right; padding: 8px 0;">
              <span style="font-size: 16px;">GTBank</span>
            </td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 8px 0;">Account Name:</td>
            <td style="color: #1e293b; font-weight: 600; text-align: right; padding: 8px 0;">
              KOLAQ ALAGBO INTERNATIONAL
            </td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 8px 0;">Account Number:</td>
            <td style="text-align: right; padding: 8px 0;">
              <span style="font-size: 20px; font-weight: 700; color: #1a4d2e; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                0123456789
              </span>
            </td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 8px 0;">Amount:</td>
            <td style="text-align: right; padding: 8px 0;">
              <span style="font-size: 18px; font-weight: 700; color: #1a4d2e;">
                ${formatCurrency(data.total, curr)}
              </span>
            </td>
          </tr>
          <tr style="border-top: 2px solid #e2e8f0;">
            <td style="color: #64748b; padding: 12px 0 8px 0;">Reference:</td>
            <td style="text-align: right; padding: 12px 0 8px 0;">
              <span style="font-size: 16px; font-weight: 700; color: #dc2626; font-family: 'Courier New', monospace;">
                ${data.orderNumber}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #991b1b;">
          <strong>⚠️ Important:</strong><br>
          Please use <strong>${data.orderNumber}</strong> as your payment reference/narration. This helps us identify and confirm your payment quickly.
        </p>
      </div>
      ` : `
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 30px 0 15px 0;">International Payment Options</h3>
      
      <div class="info-card">
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #64748b;">
          For international orders, please use one of the following payment methods:
        </p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e293b;">
          <li style="margin-bottom: 8px;">Credit/Debit Card (Visa, Mastercard)</li>
          <li style="margin-bottom: 8px;">Bank Transfer (Wire Transfer)</li>
          <li>PayPal (contact support@kolaqalagbo.org)</li>
        </ul>
      </div>
      `}
      
      <hr class="divider">
      
      <div style="text-align: center;">
        <p class="message" style="margin-bottom: 20px;">
          After making payment, your order will be automatically confirmed within 5-15 minutes.
        </p>
        <a href="https://kolaqalagbo.org/orders/${data.orderNumber}" class="cta-button">View Order Details</a>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin-top: 25px;">
        <p style="margin: 0; font-size: 14px; color: #14532d;">
          <strong>📞 Payment Assistance</strong><br>
          Having trouble with payment? Contact us:<br>
          WhatsApp: <a href="https://wa.me/2348157065742" style="color: #15803d; text-decoration: none; font-weight: 600;">+234 815 706 5742</a><br>
          Email: <a href="mailto:support@kolaqalagbo.org" style="color: #15803d; text-decoration: none;">support@kolaqalagbo.org</a><br>
          <span style="font-size: 12px; color: #16a34a;">Available Mon-Sat, 9AM - 6PM WAT</span>
        </p>
      </div>

      <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <p style="margin: 0; font-size: 13px; color: #92400e;">
          <strong>⏰ Note:</strong> Orders not paid within 24 hours will be automatically cancelled. Please complete payment to secure your order.
        </p>
      </div>
    </div>
  `;

  return getBaseTemplate(content, `Payment Instructions - Order ${data.orderNumber}`);
}
