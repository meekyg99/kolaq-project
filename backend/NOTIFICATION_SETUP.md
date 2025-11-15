# Notification System Setup

## ✅ What's Built

### NotificationModule - Complete Email Notification System
- ✅ Email service via Resend API
- ✅ SMS placeholder (ready for Twilio)
- ✅ WhatsApp placeholder (ready for WhatsApp Business API)
- ✅ Beautiful HTML email templates
- ✅ Automatic order confirmation emails
- ✅ Automatic order status update emails
- ✅ Manual notification sending (admin)
- ✅ Notification tracking & history
- ✅ Success/failure logging
- ✅ Notification statistics

**5 Endpoints** for notification management

---

## 📧 Email Templates

### 1. Order Confirmation Email
**Automatically sent when order is created**

Features:
- Branded header with gradient
- Order number prominently displayed
- Itemized product list with quantities and prices
- Subtotal, shipping, and total
- Shipping address
- Track order instructions
- Responsive design

### 2. Order Status Update Email
**Automatically sent when order status changes**

Status-specific designs:
- **PAID** - Green theme, payment confirmation
- **PROCESSING** - Blue theme, order being prepared
- **SHIPPED** - Purple theme, tracking info
- **DELIVERED** - Green theme, thank you message
- **CANCELLED** - Red theme, cancellation notice

Each includes:
- Status icon and color coding
- Order number
- Custom message per status
- Contact information

---

## 🔧 Setup Instructions

### Step 1: Database Migration
Run this SQL in your Supabase SQL Editor:
```sql
-- See: backend/prisma/add_notifications.sql
```

This creates:
- `Notification` table
- `NotificationType` enum (EMAIL, SMS, WHATSAPP)
- `NotificationStatus` enum (PENDING, SENT, FAILED, DELIVERED)

### Step 2: Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Create API key
4. Add to `.env`:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   FROM_EMAIL="noreply@yourdomain.com"
   ```

**Free Tier Limits:**
- 3,000 emails per month
- 100 emails per day
- Perfect for getting started!

### Step 3: Domain Setup (Optional but Recommended)
For production, verify your domain in Resend:
1. Add your domain in Resend dashboard
2. Add DNS records (MX, TXT, CNAME)
3. Update `FROM_EMAIL` to use your domain

Without verified domain, emails go from `onboarding@resend.dev`

---

## 📊 How It Works

### Automatic Notifications

**When Order is Created:**
```javascript
// Order created
↓
// System automatically sends confirmation email
↓
// Customer receives beautiful HTML email
// Email saved to Notification table
```

**When Order Status Updates:**
```javascript
// Admin updates order status (PAID, PROCESSING, SHIPPED, etc.)
↓
// System automatically sends status update email
↓
// Customer receives styled update notification
// Email saved to Notification table
```

### Manual Notifications (Admin)

Admins can send custom notifications via API:
```bash
POST /api/v1/notifications/send
{
  "type": "EMAIL",
  "recipient": "customer@example.com",
  "subject": "Special Offer",
  "message": "<html>...</html>"
}
```

---

## 🎯 Current Capabilities

### Email (✅ Ready)
- Resend integration complete
- HTML email templates
- Automatic sending on order events
- Delivery tracking
- Error handling

### SMS (🚧 Placeholder)
To enable:
1. Install Twilio SDK: `npm install twilio`
2. Add Twilio credentials to `.env`
3. Implement `sendSMS()` method in NotificationService

### WhatsApp (🚧 Placeholder)
To enable:
1. Set up WhatsApp Business API
2. Add credentials to `.env`
3. Implement `sendWhatsApp()` method in NotificationService

---

## 📈 Monitoring & Analytics

### Notification Stats Endpoint
`GET /api/v1/notifications/stats`

Returns:
```json
{
  "totalNotifications": 150,
  "sentNotifications": 145,
  "failedNotifications": 5,
  "pendingNotifications": 0,
  "byType": {
    "email": 145,
    "sms": 0,
    "whatsapp": 0
  },
  "successRate": "96.67%"
}
```

### Notification History
`GET /api/v1/notifications`

Filter by:
- Type (EMAIL/SMS/WHATSAPP)
- Status (PENDING/SENT/FAILED/DELIVERED)
- Recipient
- Date range

---

## 🔍 Testing

### Test Order Confirmation
```bash
# Create an order, confirmation email sent automatically
POST /api/v1/orders
{
  "customerEmail": "test@example.com",
  "customerName": "Test User",
  ...
}
```

### Test Manual Email
```bash
# Send custom email (admin only)
POST /api/v1/notifications/send
Authorization: Bearer <admin-token>
{
  "type": "EMAIL",
  "recipient": "test@example.com",
  "subject": "Test Email",
  "message": "<h1>Hello!</h1><p>This is a test.</p>"
}
```

### Test Status Update
```bash
# Update order status, email sent automatically
PATCH /api/v1/orders/:orderId/status
Authorization: Bearer <admin-token>
{
  "status": "SHIPPED"
}
```

---

## 🚨 Error Handling

The system gracefully handles failures:

1. **No API Key**: Logs warning, marks notification as failed
2. **Invalid Email**: Catches error, logs to notification table
3. **Resend API Error**: Retries may be implemented, logs error
4. **Network Failure**: Catches and logs, doesn't break order flow

All errors are logged to:
- Application logs (Winston/Pino)
- Notification table (`error` field)
- Console output

---

## 📝 Next Steps

### Immediate
1. Run database migration
2. Get Resend API key
3. Test with real order

### Future Enhancements
1. Add SMS support via Twilio
2. Add WhatsApp Business API
3. Add email templates for:
   - Low stock alerts (admin)
   - Order delayed notifications
   - Refund confirmations
   - Newsletter/broadcasts
4. Add email queueing (BullMQ)
5. Add retry logic for failed sends
6. Add unsubscribe functionality

---

## 💰 Cost Estimate

**Resend Pricing:**
- Free: 3,000 emails/month
- Pro: $20/month - 50,000 emails
- Business: Custom pricing

**Average E-commerce:**
- 2 emails per order (confirmation + status update)
- Free tier = 1,500 orders/month
- Pro tier = 25,000 orders/month

Start with free tier, upgrade as you grow!

---

## ✅ Integration Complete

The notification system is fully integrated with:
- ✅ Order creation (auto confirmation)
- ✅ Order status updates (auto notifications)
- ✅ Admin dashboard (manual sends)
- ✅ Error tracking and logging
- ✅ Beautiful branded templates

**Ready to use once Resend API key is added!**
