# Implementation Plan - Nigerian Features
**Date**: December 1, 2025, 22:11 UTC
**Focus**: Nigerian-specific features, Logistics, Notifications, Order Tracking

---

## 🎯 What We're Implementing

1. ✅ Nigerian States & LGA Dropdown
2. ✅ Phone Number Validation (+234 format)
3. ✅ Logistics Integration (GIG Logistics)
4. ✅ Email Notifications (Enhanced)
5. ✅ SMS Notifications (Termii)
6. ✅ Order Tracking System
7. ✅ Admin Panel Controls
8. ✅ End-to-End Testing

---

## 📋 PART 1: NIGERIAN-SPECIFIC FEATURES

### 1. Nigerian States & LGA Data

**Files to Create:**
```
backend/src/common/constants/nigerian-locations.ts
frontend/src/data/nigerian-states.ts
```

**Data Structure:**
```typescript
export const NIGERIAN_STATES = [
  {
    name: "Abia",
    lgas: ["Aba North", "Aba South", "Arochukwu", ...]
  },
  // All 36 states + FCT
];

export const LAGOS_ZONES = {
  "Island": ["Victoria Island", "Ikoyi", "Lekki", "Ajah"],
  "Mainland": ["Ikeja", "Yaba", "Surulere", "Apapa"]
};
```

### 2. Phone Number Validation

**Backend Validation:**
```typescript
// backend/src/common/validators/phone.validator.ts
export function validateNigerianPhone(phone: string): boolean {
  // Accepts: 08012345678, +2348012345678, 2348012345678
  const pattern = /^(\+?234|0)?[789][01]\d{8}$/;
  return pattern.test(phone.replace(/\s/g, ''));
}

export function formatNigerianPhone(phone: string): string {
  // Convert to: +234 801 234 5678
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234')) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith('0')) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}
```

---

## 📦 PART 2: LOGISTICS INTEGRATION

### GIG Logistics Integration

**Required Environment Variables:**
```env
GIG_API_KEY=your_gig_api_key
GIG_BASE_URL=https://api.giglogistics.com/v1
GIG_SENDER_ADDRESS=Your warehouse address
```

**Backend Module Structure:**
```
backend/src/modules/logistics/
├── logistics.module.ts
├── logistics.service.ts
├── logistics.controller.ts
├── dto/
│   ├── calculate-shipping.dto.ts
│   ├── create-shipment.dto.ts
│   └── track-shipment.dto.ts
└── interfaces/
    └── gig-logistics.interface.ts
```

**Key Features:**
1. Calculate shipping rates by zone
2. Generate waybill
3. Track shipment status
4. Update order with tracking info
5. Handle delivery confirmations

**Shipping Zones & Rates:**
```typescript
export const SHIPPING_ZONES = {
  "Lagos-Island": { NGN: 3000, USD: 12 },
  "Lagos-Mainland": { NGN: 2500, USD: 10 },
  "South-West": { NGN: 4000, USD: 15 },
  "South-East": { NGN: 4500, USD: 17 },
  "South-South": { NGN: 4500, USD: 17 },
  "North-Central": { NGN: 5000, USD: 19 },
  "North-West": { NGN: 5500, USD: 21 },
  "North-East": { NGN: 5500, USD: 21 },
};
```

---

## 📧 PART 3: EMAIL NOTIFICATIONS (COMPLETE)

### Current State: ⚠️ Basic emails only

### What's Missing:

**1. Email Templates Needed:**
- [ ] Order Confirmation (with Nigerian details)
- [ ] Payment Confirmation (with bank transfer details)
- [ ] Order Dispatched (with tracking link)
- [ ] Order Delivered
- [ ] Order Cancelled/Refunded
- [ ] Low Stock Alert (admin)
- [ ] New Order Alert (admin)

**2. Email Service Setup:**

**Using Resend (Already configured):**
```typescript
// backend/src/modules/notification/email-templates/
├── order-confirmation.template.ts
├── payment-confirmation.template.ts
├── dispatch-notification.template.ts
├── delivery-confirmation.template.ts
└── admin-alerts.template.ts
```

**3. Template Requirements:**

**Order Confirmation Template:**
```html
- Order Number
- Products ordered (with images)
- Amount in Naira/USD
- Customer details
- Delivery address (Nigerian format)
- Estimated delivery (X days)
- Customer service contact
- WhatsApp support link
- Track order link
```

**Payment Confirmation (Bank Transfer):**
```html
- Bank account details
- Account name: KOLAQ ALAGBO INTERNATIONAL
- Bank: [Your bank]
- Account number: [Your account]
- Amount to pay: ₦X,XXX
- Reference: ORDER-XXXXX
- Payment deadline: 24 hours
```

---

## 💬 PART 4: SMS NOTIFICATIONS

### Termii Integration

**Sign Up:**
1. Go to termii.com
2. Complete registration
3. Request sender ID: "KOLAQALAGBO" or "KolaqBitters"
4. Get API key

**Environment Variables:**
```env
TERMII_API_KEY=your_api_key
TERMII_SENDER_ID=KOLAQALAGBO
```

**Backend Module:**
```typescript
// backend/src/modules/notification/sms.service.ts
export class SmsService {
  async sendOrderConfirmation(phone: string, orderNumber: string) {
    const message = `Thank you for your order! Order #${orderNumber} has been received. Track: https://kolaqalagbo.org/track-order/${orderNumber}`;
    return this.send(phone, message);
  }

  async sendDispatchNotification(phone: string, trackingNumber: string) {
    const message = `Your order has been dispatched! Tracking #${trackingNumber}. Track at: https://kolaqalagbo.org/track/${trackingNumber}`;
    return this.send(phone, message);
  }

  async sendDeliveryConfirmation(phone: string) {
    const message = `Your KOLAQ ALAGBO order has been delivered! Enjoy your premium herbal bitters. Rate your experience: [link]`;
    return this.send(phone, message);
  }
}
```

**SMS Notifications Needed:**
1. Order received
2. Payment confirmed
3. Order dispatched (with tracking)
4. Out for delivery
5. Delivered
6. Order issues/delays

---

## 📍 PART 5: ORDER TRACKING SYSTEM

### Current State: ⚠️ Basic order history only

### What to Add:

**1. Order Status Enum (Update Prisma):**
```typescript
enum OrderStatus {
  PENDING              // Order created, awaiting payment
  PAYMENT_PENDING      // Payment initiated
  PAID                 // Payment confirmed
  PROCESSING           // Being prepared
  READY_FOR_DISPATCH   // Packed, ready to ship
  DISPATCHED           // Handed to logistics
  IN_TRANSIT           // In delivery
  OUT_FOR_DELIVERY     // With delivery agent
  DELIVERED            // Successfully delivered
  CANCELLED            // Cancelled by customer/admin
  REFUNDED             // Payment refunded
  FAILED               // Delivery failed
}
```

**2. Add to Order Model:**
```typescript
model Order {
  // Existing fields...
  
  // Tracking fields
  trackingNumber     String?
  trackingUrl        String?
  carrier            String?        // "GIG Logistics", "DHL", etc.
  estimatedDelivery  DateTime?
  actualDelivery     DateTime?
  
  // Status history
  statusHistory      OrderStatusHistory[]
  
  // Delivery info
  deliveryNotes      String?
  deliveryPhoto      String?        // Proof of delivery
  deliveredBy        String?        // Driver name
  deliveredAt        DateTime?
}

model OrderStatusHistory {
  id          String   @id @default(cuid())
  orderId     String
  status      OrderStatus
  note        String?
  createdBy   String?  // Admin/System
  createdAt   DateTime @default(now())
  order       Order    @relation(fields: [orderId], references: [id])
}
```

**3. Order Tracking API:**
```typescript
// GET /api/v1/orders/:orderNumber/tracking
{
  orderNumber: "ORD-2025-001",
  status: "IN_TRANSIT",
  trackingNumber: "GIG123456789",
  trackingUrl: "https://giglogistics.com/track/GIG123456789",
  estimatedDelivery: "2025-12-05T17:00:00Z",
  statusHistory: [
    {
      status: "PENDING",
      timestamp: "2025-12-01T10:00:00Z",
      note: "Order received"
    },
    {
      status: "PAID",
      timestamp: "2025-12-01T10:15:00Z",
      note: "Payment confirmed"
    },
    {
      status: "PROCESSING",
      timestamp: "2025-12-01T14:00:00Z",
      note: "Order is being prepared"
    },
    {
      status: "DISPATCHED",
      timestamp: "2025-12-02T09:00:00Z",
      note: "Dispatched via GIG Logistics"
    }
  ]
}
```

**4. Frontend Track Order Page:**
```typescript
// frontend/src/app/track-order/page.tsx
- Search by order number
- Show visual timeline
- Show current status
- Show tracking map (optional)
- Show delivery estimate
- Contact support button
```

---

## 🎛️ PART 6: ADMIN PANEL ADDITIONS

### Current Admin Features: ✅
- Dashboard stats
- Product management
- User management
- Activity logs

### Features to Add:

**1. Order Management:**
```typescript
// Admin Order Management Panel
/admin/orders
├── All Orders (table view)
├── Pending Orders (needs action)
├── Processing Orders
├── Shipped Orders
└── Completed Orders

Actions per order:
- Update status
- Add tracking number
- Send notification
- Cancel/Refund
- View full details
- Print invoice/receipt
- Download shipping label
```

**2. Logistics Settings:**
```typescript
// /admin/settings/logistics
- Configure shipping zones & rates
- Default carrier selection
- Warehouse address
- Delivery time estimates
- Enable/disable shipping zones
- International shipping toggle
```

**3. Notification Settings:**
```typescript
// /admin/settings/notifications
- Email templates editor
- SMS templates editor
- Toggle notification types
- Test email/SMS
- Sender ID configuration
- Notification logs
```

**4. Order Status Workflow:**
```typescript
// /admin/orders/:id
- Status dropdown with all statuses
- Add tracking number field
- Send notification checkbox
- Status notes/reason
- Automatic email/SMS on status change
- Activity log display
```

**5. Shipping Management:**
```typescript
// /admin/shipping
- Pending shipments
- Generate waybill (GIG Logistics)
- Bulk status update
- Print shipping labels
- Export shipment list
```

---

## 🧪 PART 7: END-TO-END TESTING

### How to Test Complete Checkout Flow:

**1. Setup Test Environment:**

**A. Backend (.env.test):**
```env
# Test Database
DATABASE_URL=postgresql://localhost:5432/kolaq_test

# Test Payment (Sandbox)
PAYSTACK_TEST_PUBLIC_KEY=pk_test_xxx
PAYSTACK_TEST_SECRET_KEY=sk_test_xxx
STRIPE_TEST_SECRET=sk_test_xxx

# Test SMS
TERMII_TEST_API_KEY=xxx
USE_TEST_MODE=true

# Test Logistics
GIG_TEST_API_KEY=xxx
USE_GIG_SANDBOX=true
```

**B. Frontend (.env.test):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_ENV=test
```

**2. Test Data Setup:**

```typescript
// backend/prisma/seed-test.ts
- Create test products (with stock)
- Create test admin user
- Create test customer user
- Create test addresses
```

**3. Manual Testing Checklist:**

**Cart & Checkout:**
- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] Apply promo code (if exists)
- [ ] Switch currency (NGN/USD)
- [ ] Cart persists across sessions

**Checkout Form:**
- [ ] Fill customer details
- [ ] Select Nigerian state
- [ ] Select LGA
- [ ] Enter phone (+234 format)
- [ ] Form validation works
- [ ] Address saves correctly

**Payment (Test Mode):**
- [ ] Select payment method
- [ ] Paystack popup opens
- [ ] Test card: 5061020000000000063
- [ ] CVV: 123, Expiry: 12/26
- [ ] OTP: 123456
- [ ] Payment succeeds
- [ ] Order status updates to PAID

**Notifications:**
- [ ] Confirmation email received
- [ ] SMS received (test number)
- [ ] Email template displays correctly
- [ ] All order details correct

**Order Tracking:**
- [ ] Order appears in user dashboard
- [ ] Can track order by number
- [ ] Status shows correctly
- [ ] Status history visible

**Admin Panel:**
- [ ] Order appears in admin
- [ ] Can update status
- [ ] Can add tracking number
- [ ] Notifications sent on update
- [ ] Activity logged

**4. Automated Testing:**

```typescript
// backend/test/e2e/checkout.e2e-spec.ts
describe('Checkout Flow (e2e)', () => {
  it('should complete full checkout', async () => {
    // 1. Add to cart
    // 2. Get cart
    // 3. Create order
    // 4. Mock payment webhook
    // 5. Verify order status
    // 6. Check notifications sent
    // 7. Verify inventory updated
  });
});
```

**5. Test Payment Cards:**

**Paystack Test Cards:**
```
Success: 5061 0200 0000 0000 063
Declined: 5061 0200 0000 0000 014
Insufficient Funds: 5061 0200 0000 0000 022

CVV: 123
PIN: 1234
OTP: 123456
```

**6. Testing Checklist Document:**

```markdown
## E2E Test Report

Date: ___________
Tester: __________

### Cart Functionality
- [ ] Add to cart - PASS/FAIL
- [ ] Update quantity - PASS/FAIL
- [ ] Remove item - PASS/FAIL
- [ ] Cart total correct - PASS/FAIL

### Checkout Form
- [ ] Validation works - PASS/FAIL
- [ ] Nigerian states load - PASS/FAIL
- [ ] Phone format correct - PASS/FAIL

### Payment
- [ ] Paystack opens - PASS/FAIL
- [ ] Test payment success - PASS/FAIL
- [ ] Order created - PASS/FAIL

### Notifications
- [ ] Email received - PASS/FAIL
- [ ] SMS received - PASS/FAIL
- [ ] Content correct - PASS/FAIL

### Admin
- [ ] Order visible - PASS/FAIL
- [ ] Status update works - PASS/FAIL
- [ ] Tracking works - PASS/FAIL

Notes: ________________
```

---

## 📂 FILE STRUCTURE OVERVIEW

```
kolaq-alagbo-project/
├── backend/
│   └── src/
│       ├── common/
│       │   ├── constants/
│       │   │   └── nigerian-locations.ts ✨ NEW
│       │   └── validators/
│       │       └── phone.validator.ts ✨ NEW
│       └── modules/
│           ├── logistics/ ✨ NEW
│           │   ├── logistics.module.ts
│           │   ├── logistics.service.ts
│           │   └── dto/
│           ├── notification/
│           │   ├── email-templates/ ✨ ENHANCED
│           │   ├── sms.service.ts ✨ NEW
│           │   └── notification.service.ts ✨ UPDATE
│           └── orders/
│               ├── orders.service.ts ✨ UPDATE
│               └── dto/
│                   └── update-order-status.dto.ts ✨ NEW
└── frontend/
    └── src/
        ├── data/
        │   └── nigerian-states.ts ✨ NEW
        ├── components/
        │   ├── checkout/
        │   │   ├── nigerian-address-form.tsx ✨ NEW
        │   │   └── phone-input.tsx ✨ NEW
        │   └── admin/
        │       ├── order-management.tsx ✨ NEW
        │       └── shipping-settings.tsx ✨ NEW
        └── app/
            ├── track-order/
            │   └── page.tsx ✨ ENHANCED
            └── admin/
                ├── orders/ ✨ NEW
                └── settings/
                    └── logistics/ ✨ NEW
```

---

## 🚀 IMPLEMENTATION ORDER

### Phase 1 (Days 1-2): Nigerian Features
1. ✅ Add Nigerian states/LGA data
2. ✅ Phone number validation
3. ✅ Update checkout form
4. ✅ Update address display

### Phase 2 (Days 3-4): Notifications
1. ✅ Create email templates
2. ✅ Integrate Termii SMS
3. ✅ Add notification triggers
4. ✅ Test notifications

### Phase 3 (Days 5-6): Order Tracking
1. ✅ Update order model
2. ✅ Add status history
3. ✅ Create tracking API
4. ✅ Update frontend tracking page

### Phase 4 (Days 7-8): Logistics
1. ✅ GIG Logistics integration
2. ✅ Shipping rate calculator
3. ✅ Waybill generation
4. ✅ Track shipment sync

### Phase 5 (Days 9-10): Admin Panel
1. ✅ Order management UI
2. ✅ Status update interface
3. ✅ Notification settings
4. ✅ Logistics settings

### Phase 6 (Days 11-12): Testing
1. ✅ E2E test suite
2. ✅ Manual testing
3. ✅ Bug fixes
4. ✅ Documentation

---

## ✅ SUCCESS CRITERIA

- [ ] Nigerian customers can checkout with proper address format
- [ ] Phone numbers automatically format to +234
- [ ] Shipping rates calculate based on Nigerian zones
- [ ] Email confirmation sends immediately
- [ ] SMS notification sends within 30 seconds
- [ ] Order status updates in real-time
- [ ] Admin can manage all order statuses
- [ ] Tracking page shows complete order journey
- [ ] All notifications have Nigerian-specific content
- [ ] End-to-end test passes with 100% success

---

**Ready to start implementing? Let me know which phase you want to tackle first!** 🚀
