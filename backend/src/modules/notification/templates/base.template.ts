const baseStyles = `
  /* Reset */
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  
  /* Base styles */
  body { 
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; 
    line-height: 1.6; 
    color: #2d3748; 
    margin: 0; 
    padding: 0; 
    background-color: #f4f5f7; 
    -webkit-font-smoothing: antialiased;
  }
  
  .email-wrapper {
    width: 100%;
    background-color: #f4f5f7;
    padding: 40px 20px;
  }
  
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background: #ffffff; 
    border-radius: 16px; 
    overflow: hidden; 
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }
  
  /* Header with logo */
  .header { 
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%); 
    padding: 40px 30px; 
    text-align: center;
    position: relative;
  }
  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4ADE80, #22C55E, #16A34A);
  }
  .logo-container {
    margin-bottom: 15px;
  }
  .logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #4ADE80 0%, #22C55E 100%);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    letter-spacing: -1px;
  }
  .header h1 { 
    color: #ffffff; 
    margin: 0; 
    font-size: 28px; 
    font-weight: 700; 
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  .header .tagline { 
    color: #4ADE80; 
    margin: 8px 0 0; 
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }
  
  /* Content area */
  .content { 
    padding: 45px 40px; 
  }
  .greeting { 
    font-size: 20px; 
    color: #1a1a1a; 
    margin-bottom: 25px;
    font-weight: 600;
  }
  .message { 
    color: #4a5568; 
    margin-bottom: 25px;
    font-size: 15px;
    line-height: 1.7;
  }
  
  /* Status badge */
  .status-badge {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .status-pending { background: #FEF3C7; color: #92400E; }
  .status-paid { background: #DBEAFE; color: #1E40AF; }
  .status-processing { background: #E0E7FF; color: #3730A3; }
  .status-shipped { background: #D1FAE5; color: #065F46; }
  .status-delivered { background: #4ADE80; color: #ffffff; }
  .status-cancelled { background: #FEE2E2; color: #991B1B; }
  .status-refunded { background: #F3F4F6; color: #374151; }
  
  /* Order info box */
  .order-box {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 25px;
    margin: 25px 0;
  }
  .order-number {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 5px;
    font-family: 'Courier New', monospace;
  }
  .order-date {
    color: #64748b;
    font-size: 13px;
  }
  
  /* Product table */
  .product-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .product-table th {
    text-align: left;
    padding: 12px 0;
    border-bottom: 2px solid #e2e8f0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
  }
  .product-table td {
    padding: 15px 0;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }
  .product-name {
    font-weight: 600;
    color: #1a1a1a;
  }
  .product-qty {
    color: #64748b;
    font-size: 14px;
  }
  .product-price {
    font-weight: 600;
    color: #1a1a1a;
    text-align: right;
  }
  
  /* Totals */
  .totals-box {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 25px;
    margin: 25px 0;
    color: #ffffff;
  }
  .totals-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .totals-row:last-child {
    border-bottom: none;
    padding-top: 15px;
    margin-top: 10px;
    border-top: 2px solid rgba(255,255,255,0.2);
  }
  .totals-label {
    color: #a1a1aa;
    font-size: 14px;
  }
  .totals-value {
    font-weight: 600;
    font-size: 14px;
  }
  .grand-total {
    font-size: 24px !important;
    color: #4ADE80;
  }
  
  /* Tracking box */
  .tracking-box {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border: 2px solid #4ADE80;
    border-radius: 12px;
    padding: 25px;
    margin: 25px 0;
    text-align: center;
  }
  .tracking-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #065F46;
    margin-bottom: 10px;
  }
  .tracking-number {
    font-size: 22px;
    font-weight: 700;
    color: #065F46;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }
  .tracking-carrier {
    color: #059669;
    font-size: 14px;
    margin-top: 8px;
  }
  
  /* CTA Button */
  .cta-button { 
    display: inline-block; 
    background: linear-gradient(135deg, #4ADE80 0%, #22C55E 100%);
    color: #ffffff !important; 
    padding: 16px 40px; 
    text-decoration: none; 
    border-radius: 50px; 
    font-weight: 600; 
    font-size: 14px; 
    text-transform: uppercase; 
    letter-spacing: 1.5px; 
    margin: 20px 0;
    box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
    transition: all 0.3s ease;
  }
  .cta-button:hover { 
    box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
  }
  .cta-secondary {
    background: #1a1a1a;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  /* Info cards */
  .info-card {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
    margin: 15px 0;
  }
  .info-card-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 8px;
  }
  .info-card-content {
    color: #1a1a1a;
    font-size: 15px;
  }
  
  /* Footer */
  .footer { 
    background: #1a1a1a; 
    padding: 35px 40px; 
    text-align: center;
  }
  .social-links { 
    margin: 0 0 20px; 
  }
  .social-links a { 
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    color: #ffffff !important; 
    text-decoration: none; 
    margin: 0 5px;
    font-size: 14px;
    transition: background 0.3s ease;
  }
  .social-links a:hover {
    background: #4ADE80;
  }
  .footer-brand {
    color: #4ADE80;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }
  .footer p { 
    color: #a1a1aa; 
    font-size: 12px; 
    margin: 5px 0;
    line-height: 1.6;
  }
  .footer-links {
    margin: 20px 0;
  }
  .footer-links a { 
    color: #4ADE80; 
    text-decoration: none;
    font-size: 12px;
    margin: 0 10px;
  }
  .divider { 
    border: 0; 
    height: 1px; 
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    margin: 30px 0; 
  }
  .highlight { 
    color: #4ADE80; 
    font-weight: 600; 
  }
  
  /* Responsive */
  @media only screen and (max-width: 600px) {
    .content { padding: 30px 25px; }
    .header { padding: 30px 25px; }
    .footer { padding: 30px 25px; }
    .order-number { font-size: 20px; }
    .tracking-number { font-size: 18px; }
  }
`;

export function getBaseTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>KOLAQ ALAGBO</title>
  <style>${baseStyles}</style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#f4f5f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <div class="logo">KA</div>
        </div>
        <h1>KOLAQ ALAGBO</h1>
        <p class="tagline">Premium Herbal Bitters</p>
      </div>
      ${content}
      <div class="footer">
        <div class="social-links">
          <a href="https://instagram.com/kolaqalagbo" title="Instagram">📸</a>
          <a href="https://facebook.com/kolaqalagbo" title="Facebook">📘</a>
          <a href="https://twitter.com/kolaqalagbo" title="Twitter">🐦</a>
          <a href="https://wa.me/2348000000000" title="WhatsApp">💬</a>
        </div>
        <p class="footer-brand">KOLAQ ALAGBO</p>
        <p>Premium Herbal Bitters • Crafted with Tradition</p>
        <p>Lagos, Nigeria</p>
        <div class="footer-links">
          <a href="https://kolaqalagbo.org">Website</a>
          <a href="https://kolaqalagbo.org/shop">Shop</a>
          <a href="https://kolaqalagbo.org/contact">Contact</a>
        </div>
        <hr class="divider" style="margin: 20px 0;">
        <p style="color: #64748b; font-size: 11px;">
          This email was sent by KOLAQ ALAGBO. If you have questions, reply to this email or contact us at support@kolaqalagbo.org
        </p>
        <p style="color: #64748b; font-size: 11px;">
          © ${new Date().getFullYear()} KOLAQ ALAGBO. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getOrderTimeline(currentStep: number): string {
  const steps = [
    { step: 1, label: 'Confirmed', icon: '✓' },
    { step: 2, label: 'Processing', icon: '📦' },
    { step: 3, label: 'Shipped', icon: '🚚' },
    { step: 4, label: 'Delivered', icon: '🎉' },
  ];

  return `
    <div style="margin: 24px 0; padding: 20px; background: #F9FAFB; border-radius: 12px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${steps.map((s, i) => `
            <td style="text-align: center; width: 25%;">
              <div style="
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                background: ${s.step <= currentStep ? '#10B981' : '#E5E7EB'}; 
                color: ${s.step <= currentStep ? 'white' : '#9CA3AF'};
                display: inline-flex; 
                align-items: center; 
                justify-content: center;
                font-size: 18px;
                margin-bottom: 8px;
              ">
                ${s.step < currentStep ? '✓' : s.icon}
              </div>
              <p style="
                margin: 0; 
                font-size: 12px; 
                font-weight: ${s.step === currentStep ? '600' : '400'};
                color: ${s.step <= currentStep ? '#1F2937' : '#9CA3AF'};
              ">
                ${s.label}
              </p>
            </td>
          `).join('')}
        </tr>
        <tr>
          <td colspan="4" style="padding-top: 12px;">
            <div style="height: 4px; background: #E5E7EB; border-radius: 2px; position: relative;">
              <div style="
                height: 4px; 
                background: #10B981; 
                border-radius: 2px; 
                width: ${Math.min((currentStep - 1) * 33.33, 100)}%;
              "></div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function getStatusBadge(status: string): string {
  const statusMap: Record<string, { class: string; label: string }> = {
    PENDING: { class: 'status-pending', label: 'Pending' },
    PAID: { class: 'status-paid', label: 'Paid' },
    PROCESSING: { class: 'status-processing', label: 'Processing' },
    SHIPPED: { class: 'status-shipped', label: 'Shipped' },
    DELIVERED: { class: 'status-delivered', label: 'Delivered' },
    CANCELLED: { class: 'status-cancelled', label: 'Cancelled' },
    REFUNDED: { class: 'status-refunded', label: 'Refunded' },
  };
  const s = statusMap[status] || { class: 'status-pending', label: status };
  return `<span class="status-badge ${s.class}">${s.label}</span>`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
