"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowStockAlertTemplate = lowStockAlertTemplate;
const base_template_1 = require("./base.template");
function lowStockAlertTemplate(data) {
    const productRows = data.products.map(product => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <span style="font-weight: 600; color: #1a1a1a;">${product.name}</span>
        ${product.sku ? `<br><span style="font-size: 12px; color: #888;">SKU: ${product.sku}</span>` : ''}
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
        <span style="background: ${product.currentStock <= 5 ? '#ffebee' : '#fff3e0'}; color: ${product.currentStock <= 5 ? '#c62828' : '#e65100'}; padding: 5px 12px; border-radius: 20px; font-weight: 600; font-size: 13px;">
          ${product.currentStock} left
        </span>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; color: #888;">
        ${product.threshold}
      </td>
    </tr>
  `).join('');
    const criticalCount = data.products.filter(p => p.currentStock <= 5).length;
    const warningCount = data.products.length - criticalCount;
    const content = `
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 60px; margin-bottom: 10px;">📦⚠️</div>
        <h2 style="color: #1a1a1a; margin: 0;">Low Stock Alert</h2>
        <p style="color: #888; margin: 10px 0 0;">${data.products.length} product${data.products.length > 1 ? 's' : ''} need${data.products.length === 1 ? 's' : ''} attention</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
        ${criticalCount > 0 ? `
          <div style="background: #ffebee; padding: 15px 25px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #c62828;">${criticalCount}</div>
            <div style="font-size: 12px; color: #c62828;">Critical (≤5)</div>
          </div>
        ` : ''}
        ${warningCount > 0 ? `
          <div style="background: #fff3e0; padding: 15px 25px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #e65100;">${warningCount}</div>
            <div style="font-size: 12px; color: #e65100;">Warning</div>
          </div>
        ` : ''}
      </div>

      <div style="background: #f9f9f9; border-radius: 8px; overflow: hidden; margin: 25px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #1a1a1a;">
              <th style="padding: 15px; text-align: left; color: white; font-weight: 600;">Product</th>
              <th style="padding: 15px; text-align: center; color: white; font-weight: 600;">Stock</th>
              <th style="padding: 15px; text-align: center; color: white; font-weight: 600;">Threshold</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
      </div>

      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0; color: #1565c0; font-size: 14px;">
          <strong>💡 Recommendation:</strong> Consider restocking these items soon to avoid stockouts and maintain customer satisfaction.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://kolaqalagbo.org/admin/inventory" class="cta-button">Manage Inventory</a>
      </div>

      <hr class="divider">

      <p class="message" style="font-size: 13px; text-align: center; color: #888;">
        This is an automated alert from your KOLAQ ALAGBO inventory system.<br>
        Adjust your low stock thresholds in the admin dashboard if needed.
      </p>
    </div>
  `;
    return (0, base_template_1.getBaseTemplate)(content, `Low Stock Alert: ${data.products.length} product(s) need restocking`);
}
//# sourceMappingURL=low-stock-alert.template.js.map