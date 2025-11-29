import { getBaseTemplate } from './base.template';

interface LowStockProduct {
  name: string;
  currentStock: number;
  threshold: number;
  sku?: string;
}

interface LowStockAlertData {
  products: LowStockProduct[];
}

export function lowStockAlertTemplate(data: LowStockAlertData): string {
  const criticalCount = data.products.filter(p => p.currentStock <= 5).length;
  const warningCount = data.products.length - criticalCount;

  const productRows = data.products.map(product => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #E5E7EB;">
        <span style="font-weight: 600; color: #1F2937; display: block;">${product.name}</span>
        ${product.sku ? `<span style="font-size: 12px; color: #6B7280;">SKU: ${product.sku}</span>` : ''}
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #E5E7EB; text-align: center;">
        <span style="background: ${product.currentStock <= 5 ? '#FEE2E2' : '#FEF3C7'}; 
                     color: ${product.currentStock <= 5 ? '#DC2626' : '#D97706'}; 
                     padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 13px;">
          ${product.currentStock} left
        </span>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #6B7280;">
        ${product.threshold}
      </td>
    </tr>
  `).join('');

  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 64px; margin-bottom: 16px;">📦</div>
      <h1 style="color: #1F2937; margin: 0 0 8px 0; font-size: 28px;">Low Stock Alert</h1>
      <p style="color: #6B7280; margin: 0; font-size: 16px;">
        ${data.products.length} product${data.products.length > 1 ? 's' : ''} need${data.products.length === 1 ? 's' : ''} attention
      </p>
    </div>

    <div style="margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${criticalCount > 0 ? `
          <td style="padding: 8px;">
            <div style="background: #FEE2E2; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #DC2626;">${criticalCount}</div>
              <div style="font-size: 12px; color: #991B1B; font-weight: 600; margin-top: 4px;">🚨 Critical (≤5)</div>
            </div>
          </td>
          ` : ''}
          ${warningCount > 0 ? `
          <td style="padding: 8px;">
            <div style="background: #FEF3C7; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #D97706;">${warningCount}</div>
              <div style="font-size: 12px; color: #92400E; font-weight: 600; margin-top: 4px;">⚠️ Warning</div>
            </div>
          </td>
          ` : ''}
        </tr>
      </table>
    </div>

    <div style="background: #F9FAFB; border-radius: 12px; overflow: hidden; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <thead>
          <tr style="background: #1F2937;">
            <th style="padding: 16px; text-align: left; color: white; font-weight: 600; font-size: 14px;">Product</th>
            <th style="padding: 16px; text-align: center; color: white; font-weight: 600; font-size: 14px;">Stock</th>
            <th style="padding: 16px; text-align: center; color: white; font-weight: 600; font-size: 14px;">Threshold</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
    </div>

    <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">💡 Recommendation</h3>
      <p style="color: #166534; margin: 0; font-size: 14px; line-height: 1.5;">
        Consider restocking these items soon to avoid stockouts and maintain customer satisfaction.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://kolaqalagbo.com/admin" 
         style="display: inline-block; background: #10B981; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Manage Inventory →
      </a>
    </div>

    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E5E7EB; margin-top: 24px;">
      <p style="color: #6B7280; margin: 0; font-size: 12px;">
        This is an automated alert from your KOLAQ ALAGBO inventory system.<br>
        Adjust your low stock thresholds in the admin dashboard if needed.
      </p>
    </div>
  `;

  return getBaseTemplate(content, `Low Stock Alert: ${data.products.length} product(s) need restocking`);
}
