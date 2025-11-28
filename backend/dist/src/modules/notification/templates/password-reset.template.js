"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetTemplate = passwordResetTemplate;
const base_template_1 = require("./base.template");
function passwordResetTemplate(data) {
    const content = `
    <div class="content">
      <p class="greeting">Hello, <span class="highlight">${data.customerName}</span></p>
      
      <p class="message">
        We received a request to reset the password for your KOLAQ ALAGBO account. 
        If you made this request, click the button below to create a new password.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.resetUrl}" class="cta-button">Reset Password</a>
      </div>

      <div style="background: #fff3cd; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
          <strong>⏰ This link expires in 1 hour</strong><br>
          For security reasons, this password reset link will expire in 60 minutes.
        </p>
      </div>

      <p class="message">
        If you didn't request a password reset, you can safely ignore this email. 
        Your password will remain unchanged.
      </p>

      <hr class="divider">

      <p class="message" style="font-size: 13px; color: #888;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <a href="${data.resetUrl}" style="color: #4ADE80; word-break: break-all;">${data.resetUrl}</a>
      </p>

      <p class="message" style="font-size: 13px; color: #888;">
        If you didn't request this email, please contact our support team immediately at 
        <a href="mailto:support@kolaqalagbo.org" style="color: #4ADE80;">support@kolaqalagbo.org</a>
      </p>
    </div>
  `;
    return (0, base_template_1.getBaseTemplate)(content, `Reset your KOLAQ ALAGBO password. This link expires in 1 hour.`);
}
//# sourceMappingURL=password-reset.template.js.map