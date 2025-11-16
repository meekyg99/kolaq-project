# Background Jobs & Email Integration Setup

## Overview
Successfully implemented background job processing system with email notifications, webhooks, and inventory reconciliation capabilities.

## Components Implemented

### 1. Jobs Module (`src/jobs/`)
- **JobsModule**: Main module coordinating all background job functionality
- Integrates BullMQ for reliable job queue management
- Exports EmailService for use across the application

### 2. Email Service (`src/jobs/services/email.service.ts`)
- **Resend Integration**: Connected with API key `re_QeeqUe2U_HEWRLgNsmsPZWKuZuHheLWfw`
- **Email Types Supported**:
  - Order confirmations
  - Low stock alerts
  - Broadcast notifications
  - Generic emails

### 3. Processors

#### Email Processor (`src/jobs/processors/email.processor.ts`)
- Handles all email job types
- Retry logic with exponential backoff
- Logging for debugging and monitoring
- Job types:
  - `order_confirmation`: Sent when orders are placed
  - `low_stock`: Alerts admin when inventory is low
  - `broadcast`: Send to multiple recipients
  - `generic`: Custom email content

#### Inventory Processor (`src/jobs/processors/inventory.processor.ts`)
- **Reconciliation Job**: Calculates actual stock from inventory events
- **Low Stock Check**: Monitors inventory levels and sends alerts
- Logs all reconciliation activities to ActivityLog
- Threshold: Alerts when stock ≤ 10 units

### 4. Schedulers (`src/jobs/schedulers/inventory.scheduler.ts`)
- **Daily Reconciliation**: Runs at 2 AM daily
- **Low Stock Check**: Runs at 8 AM daily
- Uses cron expressions for scheduling
- Automatic job queuing with retry logic

## Configuration

### Environment Variables
```
RESEND_API_KEY=re_QeeqUe2U_HEWRLgNsmsPZWKuZuHheLWfw
ADMIN_EMAIL=admin@kolaqbitters.com
SUPPORT_EMAIL=support@kolaqbitters.com
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Queue Configuration
- **emails**: Processes all email notifications
- **inventory**: Handles inventory reconciliation and checks
- **webhooks**: Reserved for payment webhook processing

## Features

### Email Capabilities
1. **Transactional Emails**
   - Order confirmations with order details
   - Shipping notifications
   - Status updates

2. **Alert Emails**
   - Low stock warnings to admin
   - Inventory reconciliation reports
   - System notifications

3. **Broadcast Emails**
   - Marketing campaigns
   - Product announcements
   - Bulk notifications to customers

### Inventory Management
1. **Automatic Reconciliation**
   - Calculates stock from inventory events
   - Runs daily at 2 AM
   - Logs all changes to activity log

2. **Low Stock Monitoring**
   - Checks all products daily at 8 AM
   - Sends consolidated alert email
   - Threshold: 10 units

3. **Activity Logging**
   - All reconciliations logged
   - Tracks stock changes
   - Audit trail for compliance

## Dependencies Installed
- `@nestjs/bull`: NestJS integration for BullMQ
- `@nestjs/schedule`: Cron job scheduling
- `bullmq`: Job queue management
- `ioredis`: Redis client
- `resend`: Email API client

## Usage Examples

### Queue an Email Job
```typescript
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

constructor(@InjectQueue('emails') private emailQueue: Queue) {}

await this.emailQueue.add('email-job', {
  type: 'order_confirmation',
  data: {
    orderId: '123',
    email: 'customer@example.com'
  }
});
```

### Trigger Manual Reconciliation
```typescript
@InjectQueue('inventory') private inventoryQueue: Queue

await this.inventoryQueue.add('reconcile', {
  productId: 'specific-product-id', // Optional: reconcile single product
  checkLowStock: true
});
```

## Integration with Existing Modules

### Order Module
- Can queue order confirmation emails
- Automatic notifications on status changes

### Inventory Module
- Automatic reconciliation after stock adjustments
- Low stock alerts integrated

### Notification Module
- EmailService exported for direct use
- Compatible with existing notification system

## Deployment Considerations

### Railway Deployment
- Requires Redis service for job queues
- Environment variables must be set
- Resend API key configured
- Background jobs will auto-start with application

### Future Enhancements
1. **Webhook Processor**: Handle Stripe/Paystack webhooks asynchronously
2. **SMS Integration**: Add Twilio SMS notifications
3. **WhatsApp Integration**: Automated WhatsApp messages
4. **Retry Dashboard**: Web UI to monitor and retry failed jobs
5. **Email Templates**: HTML templates for better-looking emails

## Monitoring & Debugging

### Logs
- All jobs log start/completion
- Errors logged with stack traces
- Activity logs track inventory changes

### Job Status
- Failed jobs automatically retry (3 attempts)
- Exponential backoff between retries (5s, 25s, 125s)

## Next Steps
1. Deploy to Railway (already pushed to GitHub)
2. Test email sending in production
3. Monitor job execution logs
4. Add payment webhook processor when keys are available
5. Create email templates for better UX
