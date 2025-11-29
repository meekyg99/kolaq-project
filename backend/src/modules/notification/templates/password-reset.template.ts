import { getBaseTemplate } from './base.template';

interface PasswordResetData {
  customerName: string;
  resetUrl: string;
}

export function passwordResetTemplate(data: PasswordResetData): string {
  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 64px; margin-bottom: 16px;">🔐</div>
      <h1 style="color: #1F2937; margin: 0 0 8px 0; font-size: 28px;">Reset Your Password</h1>
      <p style="color: #6B7280; margin: 0; font-size: 16px;">We received your request, ${data.customerName.split(' ')[0]}</p>
    </div>

    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="color: #1F2937; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
        We received a request to reset the password for your KOLAQ ALAGBO account. 
        Click the button below to create a new password.
      </p>
      <a href="${data.resetUrl}" 
         style="display: inline-block; background: #10B981; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Reset Password →
      </a>
    </div>

    <div style="background: #FEF3C7; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 48px; vertical-align: top;">
            <div style="font-size: 32px;">⏰</div>
          </td>
          <td style="vertical-align: top;">
            <h3 style="color: #92400E; margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">Link Expires in 1 Hour</h3>
            <p style="color: #78350F; margin: 0; font-size: 14px;">
              For your security, this password reset link will expire in 60 minutes.
            </p>
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #FEE2E2; border-left: 4px solid #EF4444; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: #991B1B; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">⚠️ Didn't Request This?</h3>
      <p style="color: #7F1D1D; margin: 0; font-size: 14px; line-height: 1.5;">
        If you didn't request a password reset, you can safely ignore this email. 
        Your password will remain unchanged. If you're concerned about your account security, 
        please contact us immediately.
      </p>
    </div>

    <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #6B7280; margin: 0; font-size: 12px; text-align: center;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${data.resetUrl}" style="color: #10B981; word-break: break-all; font-size: 11px;">${data.resetUrl}</a>
      </p>
    </div>

    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E5E7EB; margin-top: 24px;">
      <p style="color: #6B7280; margin: 0 0 8px 0; font-size: 14px;">
        Need help? Contact our support team
      </p>
      <a href="mailto:support@kolaqalagbo.com" 
         style="color: #10B981; text-decoration: none; font-weight: 600; font-size: 14px;">
        support@kolaqalagbo.com
      </a>
    </div>
  `;

  return getBaseTemplate(content, `Reset your KOLAQ ALAGBO password. This link expires in 1 hour.`);
}
