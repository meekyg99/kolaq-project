# Admin Dashboard Module

## ✅ What's Built

### AdminModule - Complete Dashboard & Analytics System
- ✅ **Dashboard Overview** - Key metrics at a glance
- ✅ **Sales Analytics** - Revenue tracking & trends
- ✅ **Top Products Report** - Best-selling items
- ✅ **Customer Insights** - Customer behavior analysis
- ✅ **Broadcast Notifications** - Send emails to customer segments
- ✅ **Activity Logging** - Track all admin actions
- ✅ **Activity Statistics** - Monitor system usage

**8 Endpoints** for admin dashboard

---

## 📊 Features

### 1. Dashboard Overview
`GET /api/v1/admin/dashboard`

**Returns comprehensive stats:**
```json
{
  "overview": {
    "totalProducts": 50,
    "totalOrders": 245,
    "totalCustomers": 180,
    "revenue": {
      "NGN": 1250000,
      "USD": 3500
    },
    "ordersLast30Days": 45,
    "ordersLast7Days": 12
  },
  "recentOrders": [
    {
      "orderNumber": "ORD-XYZ",
      "customerName": "John Doe",
      "total": 25000,
      "currency": "NGN",
      "status": "PAID",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "lowStockProducts": [
    {
      "name": "Kolaq Bitters 200ml",
      "currentStock": 5
    }
  ],
  "notifications": {
    "totalNotifications": 500,
    "sentNotifications": 485,
    "successRate": "97%"
  }
}
```

---

### 2. Sales Analytics
`GET /api/v1/admin/analytics?days=30`

**Query Params:**
- `days` (optional, default: 30) - Number of days to analyze

**Returns:**
```json
{
  "period": "30 days",
  "dailyStats": [
    {
      "date": "2025-01-15",
      "orders": 5,
      "revenue": { "NGN": 125000, "USD": 350 },
      "statuses": {
        "PENDING": 1,
        "PAID": 3,
        "SHIPPED": 1
      }
    }
  ],
  "summary": {
    "totalOrders": 45,
    "totalRevenue": {
      "NGN": 1125000,
      "USD": 3150
    },
    "averageOrderValue": {
      "NGN": 25000,
      "USD": 70
    }
  }
}
```

---

### 3. Top Products
`GET /api/v1/admin/top-products?limit=10`

**Query Params:**
- `limit` (optional, default: 10) - Number of products

**Returns:**
```json
[
  {
    "id": "prod_123",
    "name": "Kolaq Bitters 200ml",
    "slug": "kolaq-bitters-200ml",
    "category": "Bitters",
    "totalQuantitySold": 150,
    "totalOrders": 85
  }
]
```

---

### 4. Customer Insights
`GET /api/v1/admin/customer-insights`

**Returns:**
```json
{
  "totalCustomers": 180,
  "repeatCustomers": 65,
  "repeatRate": "36.11%",
  "topCustomers": [
    {
      "email": "customer@example.com",
      "totalOrders": 8,
      "totalSpent": {
        "NGN": 200000,
        "USD": 0
      },
      "firstOrder": "2024-01-01T00:00:00Z",
      "lastOrder": "2025-01-10T00:00:00Z"
    }
  ]
}
```

---

### 5. Broadcast Notifications
`POST /api/v1/admin/broadcast`

**Send emails to customer segments:**
```json
{
  "subject": "Special Offer - 20% Off!",
  "message": "<html>...</html>",
  "filter": "recent-customers"
}
```

**Filters:**
- `all` - All customers
- `recent-customers` - Customers from last 30 days
- `high-value` - Customers who spent ≥ ₦50,000
- Custom `recipients` array

**Response:**
```json
{
  "totalRecipients": 45,
  "successful": 44,
  "failed": 1,
  "recipients": ["email1@example.com", "..."]
}
```

---

### 6. Activity Logging
`POST /api/v1/admin/activity/log`

**Track admin actions:**
```json
{
  "type": "PRODUCT_CREATED",
  "action": "Created new product",
  "description": "Added Kolaq Bitters 500ml",
  "metadata": {
    "productId": "prod_123",
    "productName": "Kolaq Bitters 500ml"
  }
}
```

Auto-captures:
- User ID & email (from JWT)
- IP address
- User agent
- Timestamp

---

### 7. Activity History
`GET /api/v1/admin/activity`

**Query Params:**
- `type` (optional) - Filter by activity type
- `userId` (optional) - Filter by user
- `userEmail` (optional) - Filter by email
- `startDate` (optional) - From date
- `endDate` (optional) - To date
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Returns:**
```json
{
  "logs": [
    {
      "id": "log_123",
      "type": "PRODUCT_UPDATED",
      "userId": "user_456",
      "userEmail": "admin@kolaqbitters.com",
      "action": "Updated product price",
      "description": "Changed price from ₦5000 to ₦5500",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-15T14:30:00Z"
    }
  ],
  "total": 250,
  "limit": 50,
  "offset": 0
}
```

---

### 8. Activity Statistics
`GET /api/v1/admin/activity/stats`

**Returns:**
```json
{
  "totalActivities": 1250,
  "todayActivities": 35,
  "byType": {
    "LOGIN": 450,
    "PRODUCT_UPDATED": 320,
    "ORDER_STATUS_UPDATED": 245,
    "INVENTORY_ADJUSTED": 125,
    "NOTIFICATION_SENT": 110
  },
  "recentActivities": [
    {
      "type": "PRODUCT_UPDATED",
      "action": "Updated product",
      "createdAt": "2025-01-15T14:30:00Z"
    }
  ]
}
```

---

## 🎯 Use Cases

### Daily Dashboard Check
1. Check dashboard overview for key metrics
2. Review recent orders
3. Monitor low stock alerts
4. Check notification delivery rates

### Weekly Analytics Review
1. Get 7-day analytics
2. Review top products
3. Check customer insights
4. Identify repeat customers

### Marketing Campaigns
1. Use customer insights to identify high-value customers
2. Broadcast special offers to segments
3. Track notification success rates

### Audit & Compliance
1. Review activity logs for specific date range
2. Track who made what changes
3. Monitor admin actions
4. Export logs for compliance

---

## 📈 Activity Types Tracked

- `LOGIN` - User login events
- `LOGOUT` - User logout events
- `PRODUCT_CREATED` - New product added
- `PRODUCT_UPDATED` - Product modified
- `PRODUCT_DELETED` - Product removed
- `INVENTORY_ADJUSTED` - Stock changed
- `ORDER_STATUS_UPDATED` - Order status changed
- `NOTIFICATION_SENT` - Email/SMS sent
- `SETTINGS_CHANGED` - System settings modified

---

## 🔒 Security

All endpoints require:
- ✅ Valid JWT token
- ✅ Admin role
- ✅ Active session

Unauthorized access returns `401 Unauthorized`

---

## 📊 Data Insights

### Revenue Tracking
- Track revenue by currency (NGN/USD)
- Daily/weekly/monthly trends
- Average order values
- Revenue per customer

### Product Performance
- Best-selling products
- Total quantities sold
- Number of orders per product
- Category performance

### Customer Behavior
- Total customers
- Repeat customer rate
- Customer lifetime value
- First vs. last order dates

---

## 🚀 Quick Start

### 1. Run Migration
```sql
-- See: backend/prisma/add_activity_logs.sql
```

### 2. Access Dashboard
```bash
# Login as admin
POST /api/v1/auth/login
{
  "email": "admin@kolaqbitters.com",
  "passcode": "admin123"
}

# Get dashboard
GET /api/v1/admin/dashboard
Authorization: Bearer <token>
```

### 3. View Analytics
```bash
# Get last 30 days
GET /api/v1/admin/analytics?days=30
Authorization: Bearer <token>
```

---

## 📝 Future Enhancements

- [ ] Export data to CSV/Excel
- [ ] Scheduled reports (daily/weekly emails)
- [ ] Real-time dashboard with WebSockets
- [ ] Advanced filtering & search
- [ ] Custom date range picker
- [ ] Revenue forecasting
- [ ] Inventory predictions
- [ ] Customer segmentation builder
- [ ] A/B testing for broadcasts
- [ ] Automated low-stock alerts

---

## ✅ Complete!

The Admin Dashboard Module provides:
- 📊 Comprehensive analytics
- 🎯 Customer insights
- 📧 Broadcast notifications
- 📝 Activity tracking
- 🔍 Audit trails

**Ready for production use!**
