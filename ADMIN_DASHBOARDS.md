# Admin Dashboard Documentation

## Overview
The admin dashboards provide comprehensive analytics, monitoring, and management capabilities for KOLAQ ALAGBO INTERNATIONAL's e-commerce platform.

## Authentication
All admin endpoints require:
- **JWT Authentication**: Bearer token in Authorization header
- **Admin Role**: User must have 'admin' role

### Get Admin Access Token
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@kolaqbitters.com",
  "password": "Kolaqbitters$"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@kolaqbitters.com",
    "role": "admin"
  }
}
```

---

## Dashboard Endpoints

### 1. Main Dashboard Overview
**GET** `/api/v1/admin/dashboard`

Returns comprehensive overview statistics for the platform.

#### Request
```bash
curl -X GET https://kolaq-project-production.up.railway.app/api/v1/admin/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "overview": {
    "totalProducts": 12,
    "totalOrders": 156,
    "totalCustomers": 89,
    "revenue": {
      "NGN": 2450000,
      "USD": 1850.50
    },
    "ordersLast30Days": 45,
    "ordersLast7Days": 12
  },
  "recentOrders": [
    {
      "id": "uuid",
      "orderNumber": "KLQ-20231116-001",
      "customerName": "John Doe",
      "total": 15000,
      "currency": "NGN",
      "status": "PENDING",
      "createdAt": "2023-11-16T10:30:00Z"
    }
  ],
  "lowStockProducts": [
    {
      "id": "uuid",
      "name": "Kolaq Alagbo Classic 750ml",
      "slug": "kolaq-classic-750ml",
      "category": "BOTTLES",
      "currentStock": 5
    }
  ],
  "notifications": {
    "totalSent": 234,
    "totalFailed": 12,
    "pendingJobs": 3,
    "recentNotifications": []
  }
}
```

#### Use Cases
- Homepage dashboard display
- Quick platform health check
- Real-time business metrics
- Alert on low stock items

---

### 2. Analytics Dashboard
**GET** `/api/v1/admin/analytics?days=30`

Returns detailed analytics over a specified time period.

#### Parameters
- `days` (optional): Number of days to analyze (default: 30)

#### Request
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/analytics?days=30" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "period": "30 days",
  "dailyStats": [
    {
      "date": "2023-11-01",
      "orders": 5,
      "revenue": {
        "NGN": 75000,
        "USD": 45.50
      },
      "statuses": {
        "PENDING": 2,
        "COMPLETED": 3
      }
    }
  ],
  "summary": {
    "totalOrders": 156,
    "totalRevenue": {
      "NGN": 2450000,
      "USD": 1850.50
    },
    "averageOrderValue": {
      "NGN": 15705.13,
      "USD": 11.86
    }
  }
}
```

#### Use Cases
- Trend analysis
- Revenue tracking
- Order volume monitoring
- Performance comparison across time periods

---

### 3. Top Products Dashboard
**GET** `/api/v1/admin/top-products?limit=10`

Returns best-selling products ranked by quantity sold.

#### Parameters
- `limit` (optional): Number of products to return (default: 10)

#### Request
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/top-products?limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
[
  {
    "id": "uuid",
    "name": "Kolaq Alagbo Classic 750ml",
    "slug": "kolaq-classic-750ml",
    "category": "BOTTLES",
    "totalQuantitySold": 340,
    "totalOrders": 156
  },
  {
    "id": "uuid",
    "name": "Kolaq Alagbo Gift Set",
    "slug": "kolaq-gift-set",
    "category": "GIFTS",
    "totalQuantitySold": 120,
    "totalOrders": 98
  }
]
```

#### Use Cases
- Identify popular products
- Inventory planning
- Marketing campaign targeting
- Product performance analysis

---

### 4. Customer Insights Dashboard
**GET** `/api/v1/admin/customer-insights`

Returns customer behavior analytics and segmentation.

#### Request
```bash
curl -X GET https://kolaq-project-production.up.railway.app/api/v1/admin/customer-insights \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "totalCustomers": 89,
  "topCustomers": [
    {
      "email": "customer@example.com",
      "totalOrders": 12,
      "totalSpent": {
        "NGN": 180000,
        "USD": 0
      },
      "firstOrder": "2023-06-15T10:30:00Z",
      "lastOrder": "2023-11-14T14:20:00Z"
    }
  ],
  "repeatCustomers": 34,
  "repeatRate": "38.20%"
}
```

#### Use Cases
- Customer retention analysis
- VIP customer identification
- Loyalty program targeting
- Customer lifetime value calculation

---

### 5. Activity Logs Dashboard
**GET** `/api/v1/admin/activity?type=ADMIN_ACTION&limit=50&offset=0`

Returns filterable activity logs for audit trail.

#### Parameters
- `type` (optional): Filter by activity type
- `userId` (optional): Filter by user ID
- `userEmail` (optional): Filter by user email
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `limit` (optional): Results per page (default: 50)
- `offset` (optional): Pagination offset (default: 0)

#### Request
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/activity?limit=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "logs": [
    {
      "id": "uuid",
      "type": "ADMIN_ACTION",
      "userId": "uuid",
      "userEmail": "admin@kolaqbitters.com",
      "action": "UPDATE_PRODUCT",
      "description": "Updated product inventory",
      "metadata": {
        "productId": "uuid",
        "changes": {}
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2023-11-16T10:30:00Z"
    }
  ],
  "total": 234,
  "limit": 50,
  "offset": 0
}
```

#### Use Cases
- Security auditing
- Compliance reporting
- User behavior tracking
- Debugging admin actions

---

### 6. Activity Statistics
**GET** `/api/v1/admin/activity/stats`

Returns aggregated activity statistics.

#### Request
```bash
curl -X GET https://kolaq-project-production.up.railway.app/api/v1/admin/activity/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Response
```json
{
  "totalActivities": 1234,
  "todayActivities": 45,
  "byType": {
    "ADMIN_ACTION": 456,
    "PRODUCT_UPDATE": 234,
    "ORDER_UPDATE": 544
  },
  "recentActivities": []
}
```

---

### 7. Broadcast Notifications
**POST** `/api/v1/admin/broadcast`

Send broadcast notifications to customer segments.

#### Request Body
```json
{
  "subject": "New Products Available!",
  "message": "Check out our latest collection of premium herbal drinks.",
  "filter": "all",
  "recipients": []
}
```

#### Filter Options
- `all`: All customers who have placed orders
- `recent-customers`: Customers who ordered in last 30 days
- `high-value`: Customers with lifetime spend ≥ ₦50,000

#### Request
```bash
curl -X POST https://kolaq-project-production.up.railway.app/api/v1/admin/broadcast \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Flash Sale Alert!",
    "message": "Get 20% off on all products this weekend.",
    "filter": "recent-customers"
  }'
```

#### Response
```json
{
  "totalRecipients": 45,
  "successful": 43,
  "failed": 2,
  "recipients": ["customer1@example.com", "customer2@example.com"]
}
```

#### Use Cases
- Marketing campaigns
- Product launch announcements
- Special offers and promotions
- Customer engagement

---

### 8. Log Activity
**POST** `/api/v1/admin/activity/log`

Manually log an admin activity (auto-logged for most admin actions).

#### Request Body
```json
{
  "type": "ADMIN_ACTION",
  "action": "CUSTOM_ACTION",
  "description": "Performed manual inventory adjustment",
  "metadata": {
    "reason": "Physical stock count correction"
  }
}
```

#### Request
```bash
curl -X POST https://kolaq-project-production.up.railway.app/api/v1/admin/activity/log \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ADMIN_ACTION",
    "action": "INVENTORY_ADJUSTMENT",
    "description": "Manual stock adjustment for reconciliation"
  }'
```

---

## Dashboard Integration Guide

### Frontend Dashboard Components

#### 1. Overview Dashboard
```typescript
const DashboardOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => fetch('/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total Products" value={data?.overview.totalProducts} />
      <StatCard title="Total Orders" value={data?.overview.totalOrders} />
      <StatCard title="Customers" value={data?.overview.totalCustomers} />
      <StatCard 
        title="Revenue (NGN)" 
        value={formatCurrency(data?.overview.revenue.NGN)} 
      />
    </div>
  );
};
```

#### 2. Analytics Charts
```typescript
const AnalyticsDashboard = ({ days = 30 }) => {
  const { data } = useQuery({
    queryKey: ['admin', 'analytics', days],
    queryFn: () => fetch(`/api/v1/admin/analytics?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
  });

  return (
    <div>
      <LineChart data={data?.dailyStats} />
      <SummaryCards summary={data?.summary} />
    </div>
  );
};
```

#### 3. Top Products Table
```typescript
const TopProductsTable = ({ limit = 10 }) => {
  const { data } = useQuery({
    queryKey: ['admin', 'top-products', limit],
    queryFn: () => fetch(`/api/v1/admin/top-products?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
  });

  return (
    <Table>
      {data?.map(product => (
        <TableRow key={product.id}>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.totalQuantitySold}</TableCell>
          <TableCell>{product.totalOrders}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
```

---

## Security Considerations

### Rate Limiting
All admin endpoints are protected by rate limiting:
- **10 requests per minute** per IP address
- **100 requests per hour** per user account

### Audit Logging
All admin actions are automatically logged with:
- User identification
- IP address
- User agent
- Timestamp
- Action details

### Access Control
- Only users with `admin` role can access these endpoints
- JWT tokens expire after 3600 minutes
- Invalid tokens return 401 Unauthorized

---

## Error Handling

### Common Error Codes
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Insufficient permissions"
}
```

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Rate limit exceeded"
}
```

---

## Testing the Dashboards

### Quick Test Script
```bash
#!/bin/bash

# Set your API URL
API_URL="https://kolaq-project-production.up.railway.app"

# Login and get token
TOKEN=$(curl -X POST "$API_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kolaqbitters.com","password":"Kolaqbitters$"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"

# Test Dashboard
echo "\n=== Dashboard Overview ==="
curl -X GET "$API_URL/api/v1/admin/dashboard" \
  -H "Authorization: Bearer $TOKEN" | jq

# Test Analytics
echo "\n=== Analytics (Last 7 Days) ==="
curl -X GET "$API_URL/api/v1/admin/analytics?days=7" \
  -H "Authorization: Bearer $TOKEN" | jq

# Test Top Products
echo "\n=== Top 5 Products ==="
curl -X GET "$API_URL/api/v1/admin/top-products?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# Test Customer Insights
echo "\n=== Customer Insights ==="
curl -X GET "$API_URL/api/v1/admin/customer-insights" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## Next Steps

### Recommended Enhancements
1. **Real-time Updates**: Implement WebSocket connections for live dashboard updates
2. **Export Functionality**: Add CSV/PDF export for reports
3. **Custom Date Ranges**: Allow flexible date range selection for analytics
4. **Alerts & Notifications**: Set up automated alerts for critical metrics
5. **Role-based Dashboards**: Create different dashboard views for different admin roles
6. **Mobile Dashboard**: Optimize dashboard for mobile viewing

### Integration with Frontend
The admin dashboard should be accessible at:
- `https://your-domain.com/admin/dashboard`
- `https://your-domain.com/admin/analytics`
- `https://your-domain.com/admin/products`
- `https://your-domain.com/admin/customers`
- `https://your-domain.com/admin/activity`

---

## Support
For issues or questions about the admin dashboards:
- Email: support@kolaqbitters.com
- WhatsApp: +2348157065742

**Last Updated**: November 16, 2025
**Version**: 1.0.0
