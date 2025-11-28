"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseTemplate = getBaseTemplate;
exports.formatCurrency = formatCurrency;
const baseStyles = `
  body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; text-align: center; }
  .header h1 { color: #4ADE80; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
  .header p { color: #ccc; margin: 10px 0 0; font-size: 14px; }
  .content { padding: 40px 30px; }
  .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 20px; }
  .message { color: #555; margin-bottom: 25px; }
  .cta-button { display: inline-block; background: #4ADE80; color: white !important; padding: 14px 35px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
  .cta-button:hover { background: #22C55E; }
  .footer { background: #f9f9f9; padding: 25px 30px; text-align: center; border-top: 1px solid #eee; }
  .footer p { color: #888; font-size: 12px; margin: 5px 0; }
  .social-links { margin: 15px 0; }
  .social-links a { color: #4ADE80; text-decoration: none; margin: 0 10px; }
  .highlight { color: #4ADE80; font-weight: 600; }
  .divider { border: 0; height: 1px; background: #eee; margin: 25px 0; }
`;
function getBaseTemplate(content, preheader) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KOLAQ ALAGBO</title>
  <style>${baseStyles}</style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#f7f7f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}
  <div style="padding: 20px;">
    <div class="container">
      <div class="header">
        <h1>KOLAQ ALAGBO</h1>
        <p>Premium Herbal Bitters</p>
      </div>
      ${content}
      <div class="footer">
        <div class="social-links">
          <a href="https://instagram.com/kolaqalagbo">Instagram</a>
          <a href="https://facebook.com/kolaqalagbo">Facebook</a>
          <a href="https://twitter.com/kolaqalagbo">Twitter</a>
        </div>
        <p>KOLAQ ALAGBO - Premium Herbal Bitters</p>
        <p>Lagos, Nigeria</p>
        <p style="margin-top: 15px;">
          <a href="https://kolaqalagbo.org" style="color: #4ADE80; text-decoration: none;">Visit our website</a>
        </p>
        <p style="color: #aaa; font-size: 11px; margin-top: 15px;">
          You're receiving this email because you're a valued customer of KOLAQ ALAGBO.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
function formatCurrency(amount, currency = 'NGN') {
    if (currency === 'NGN') {
        return `₦${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
}
//# sourceMappingURL=base.template.js.map