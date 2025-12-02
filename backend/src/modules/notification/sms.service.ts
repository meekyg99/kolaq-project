import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface SendSMSDto {
  to: string; // Phone number with country code (e.g., "2348157065742")
  message: string;
  senderId?: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly termiiApiKey = process.env.TERMII_API_KEY;
  private readonly termiiSenderId = process.env.TERMII_SENDER_ID || 'KOLAQ';
  private readonly termiiApiUrl = 'https://api.ng.termii.com/api/sms/send';
  private readonly isProduction = process.env.NODE_ENV === 'production';

  /**
   * Send SMS via Termii
   */
  async sendSMS(dto: SendSMSDto): Promise<boolean> {
    try {
      // In development mode or if no API key, just log
      if (!this.isProduction || !this.termiiApiKey) {
        this.logger.log(`[DEV MODE] SMS to ${dto.to}: ${dto.message}`);
        return true;
      }

      const response = await axios.post(
        this.termiiApiUrl,
        {
          to: dto.to,
          from: dto.senderId || this.termiiSenderId,
          sms: dto.message,
          type: 'plain',
          channel: 'generic',
          api_key: this.termiiApiKey,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.message_id) {
        this.logger.log(`SMS sent successfully to ${dto.to}`);
        return true;
      }

      this.logger.error(`SMS failed to ${dto.to}: ${JSON.stringify(response.data)}`);
      return false;
    } catch (error) {
      this.logger.error('SMS sending failed', error);
      return false;
    }
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmation(
    phone: string,
    orderNumber: string,
    totalAmount: number,
  ): Promise<boolean> {
    const message = `Hi! Your KOLAQ ALAGBO order ${orderNumber} for ₦${totalAmount.toLocaleString()} has been confirmed. Track at kolaqalagbo.org/track-order. Thank you!`;

    return this.sendSMS({
      to: this.formatPhoneNumber(phone),
      message,
    });
  }

  /**
   * Send payment confirmation SMS
   */
  async sendPaymentConfirmed(
    phone: string,
    orderNumber: string,
    amount: number,
  ): Promise<boolean> {
    const message = `Payment of ₦${amount.toLocaleString()} confirmed for order ${orderNumber}. We're preparing your items. Track: kolaqalagbo.org/track-order`;

    return this.sendSMS({
      to: this.formatPhoneNumber(phone),
      message,
    });
  }

  /**
   * Send order dispatched SMS
   */
  async sendOrderDispatched(
    phone: string,
    orderNumber: string,
    trackingNumber?: string,
  ): Promise<boolean> {
    const trackingInfo = trackingNumber ? ` Tracking: ${trackingNumber}` : '';
    const message = `Your order ${orderNumber} has been dispatched!${trackingInfo} Delivery soon. Track: kolaqalagbo.org/track-order`;

    return this.sendSMS({
      to: this.formatPhoneNumber(phone),
      message,
    });
  }

  /**
   * Send out for delivery SMS
   */
  async sendOutForDelivery(
    phone: string,
    orderNumber: string,
  ): Promise<boolean> {
    const message = `Great news! Your order ${orderNumber} is out for delivery today. Our rider will call you shortly. KOLAQ ALAGBO`;

    return this.sendSMS({
      to: this.formatPhoneNumber(phone),
      message,
    });
  }

  /**
   * Send delivery completed SMS
   */
  async sendDeliveryCompleted(
    phone: string,
    orderNumber: string,
  ): Promise<boolean> {
    const message = `Your order ${orderNumber} has been delivered! Thank you for shopping with KOLAQ ALAGBO. Rate your experience: kolaqalagbo.org/orders`;

    return this.sendSMS({
      to: this.formatPhoneNumber(phone),
      message,
    });
  }

  /**
   * Send order cancelled SMS
   */
  async sendOrderCancelled(
    phone: string,
    orderNumber: string,
    reason?: string,
  ): Promise<boolean> {
    const reasonText = reason ? ` Reason: ${reason}` : '';
    const message = `Your order ${orderNumber} has been cancelled.${reasonText} Refund will be processed in 3-5 days. Contact: +234 815 706 5742`;

    return this.sendSMS({
      to: this.formatPhoneNumber(phone),
      message,
    });
  }

  /**
   * Send low stock alert to admin
   */
  async sendLowStockAlert(
    adminPhone: string,
    productName: string,
    currentStock: number,
  ): Promise<boolean> {
    const message = `LOW STOCK ALERT: ${productName} has only ${currentStock} units left. Reorder soon! - KOLAQ ALAGBO Admin`;

    return this.sendSMS({
      to: this.formatPhoneNumber(adminPhone),
      message,
    });
  }

  /**
   * Send new order alert to admin
   */
  async sendNewOrderAlert(
    adminPhone: string,
    orderNumber: string,
    totalAmount: number,
    customerName: string,
  ): Promise<boolean> {
    const message = `NEW ORDER! #${orderNumber} from ${customerName} for ₦${totalAmount.toLocaleString()}. Check admin panel now.`;

    return this.sendSMS({
      to: this.formatPhoneNumber(adminPhone),
      message,
    });
  }

  /**
   * Format phone number for Nigerian standard
   * Converts various formats to 234XXXXXXXXXX
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 234
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    }

    // If doesn't start with 234, add it
    if (!cleaned.startsWith('234')) {
      cleaned = '234' + cleaned;
    }

    return cleaned;
  }

  /**
   * Validate Nigerian phone number
   */
  isValidNigerianPhone(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    // Nigerian numbers: 234 + 10 digits (total 13 digits)
    return /^234\d{10}$/.test(formatted);
  }

  /**
   * Get SMS balance (if using Termii)
   */
  async getSMSBalance(): Promise<number> {
    try {
      if (!this.isProduction || !this.termiiApiKey) {
        return 1000; // Mock balance in dev
      }

      const response = await axios.get(
        `https://api.ng.termii.com/api/get-balance?api_key=${this.termiiApiKey}`,
      );

      return parseFloat(response.data.balance) || 0;
    } catch (error) {
      this.logger.error('Failed to get SMS balance', error);
      return 0;
    }
  }
}
