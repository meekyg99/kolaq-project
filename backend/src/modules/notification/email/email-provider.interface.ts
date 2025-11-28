export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: 'resend' | 'smtp';
}

export interface IEmailProvider {
  send(options: EmailOptions): Promise<EmailResult>;
  isConfigured(): boolean;
  getProviderName(): string;
}
