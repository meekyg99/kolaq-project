# Backend API Endpoints

## Authentication (AuthModule)

### POST /api/v1/auth/login
Login with email and passcode.
- **Body**: `{ email: string, passcode: string }`
- **Response**: `{ accessToken, refreshToken, user }`
- **Access**: Public

### POST /api/v1/auth/refresh
Refresh access token.
- **Body**: `{ refreshToken: string }`
- **Response**: `{ accessToken }`
- **Access**: Public

### GET /api/v1/auth/me
Get current user profile.
- **Response**: User object
- **Access**: Protected (JWT)

---

## Catalog (CatalogModule)

### GET /api/v1/products
Get all products with filtering.
- **Query Params**: 
  - `category` (optional) - Filter by category
  - `search` (optional) - Search in name/description
  - `isFeatured` (optional) - Filter featured products
  - `currency` (optional) - Filter prices by currency (NGN/USD)
  - `limit` (optional, default: 50)
  - `offset` (optional, default: 0)
- **Response**: `{ products, total, limit, offset }`
- **Access**: Public

### GET /api/v1/products/categories
Get all unique product categories.
- **Response**: Array of category names
- **Access**: Public

### GET /api/v1/products/featured
Get featured products.
- **Query Params**: `currency` (optional)
- **Response**: Array of featured products
- **Access**: Public

### GET /api/v1/products/slug/:slug
Get product by slug.
- **Response**: Product with prices
- **Access**: Public

### GET /api/v1/products/:id
Get product by ID.
- **Response**: Product with prices
- **Access**: Public

### POST /api/v1/products
Create a new product.
- **Body**: 
  ```json
  {
    "slug": "string",
    "name": "string",
    "description": "string",
    "image": "string (optional)",
    "category": "string",
    "size": "string (optional)",
    "isFeatured": "boolean (optional)",
    "prices": [
      { "currency": "NGN" | "USD", "amount": number }
    ]
  }
  ```
- **Response**: Created product
- **Access**: Protected (Admin only)

### PATCH /api/v1/products/:id
Update a product.
- **Body**: Partial product object (same as POST)
- **Response**: Updated product
- **Access**: Protected (Admin only)

### DELETE /api/v1/products/:id
Delete a product.
- **Response**: `{ message: "Product deleted successfully" }`
- **Access**: Protected (Admin only)

---

## Inventory (InventoryModule)

### POST /api/v1/inventory/adjust
Adjust inventory for a product.
- **Body**: 
  ```json
  {
    "productId": "string",
    "delta": number,  // Positive to add, negative to subtract
    "reason": "string",
    "actorEmail": "string (optional)"
  }
  ```
- **Response**: 
  ```json
  {
    "event": InventoryEvent,
    "previousStock": number,
    "newStock": number,
    "lowStockAlert": boolean
  }
  ```
- **Access**: Protected (Admin only)

### GET /api/v1/inventory/history
Get inventory adjustment history.
- **Query Params**: 
  - `productId` (optional) - Filter by product
  - `limit` (optional, default: 50)
  - `offset` (optional, default: 0)
- **Response**: `{ events, total, limit, offset }`
- **Access**: Protected (Admin only)

### GET /api/v1/inventory/summary
Get inventory summary statistics.
- **Response**: 
  ```json
  {
    "totalProducts": number,
    "totalStock": number,
    "lowStockCount": number,
    "outOfStockCount": number,
    "lowStockThreshold": 10
  }
  ```
- **Access**: Protected (Admin only)

### GET /api/v1/inventory/low-stock
Get products with low stock (≤ 10 units).
- **Response**: Array of products with current stock
- **Access**: Protected (Admin only)

### GET /api/v1/inventory/product/:productId
Get inventory details for a specific product.
- **Response**: 
  ```json
  {
    "product": { id, name, slug },
    "currentStock": number,
    "lowStockAlert": boolean,
    "recentEvents": InventoryEvent[]
  }
  ```
- **Access**: Public

---

## Authentication Headers

For protected endpoints, include:
```
Authorization: Bearer <accessToken>
```

---

## Cart (CartModule)

### GET /api/v1/cart
Get cart by session ID.
- **Query Params**: `sessionId` (required)
- **Response**: Cart with items and totals
- **Access**: Public

### POST /api/v1/cart/add
Add item to cart.
- **Query Params**: `sessionId` (required)
- **Body**: 
  ```json
  {
    "productId": "string",
    "quantity": number
  }
  ```
- **Response**: Updated cart
- **Access**: Public

### PATCH /api/v1/cart/items/:itemId
Update cart item quantity.
- **Query Params**: `sessionId` (required)
- **Body**: `{ "quantity": number }`
- **Response**: Updated cart
- **Access**: Public

### DELETE /api/v1/cart/items/:itemId
Remove item from cart.
- **Query Params**: `sessionId` (required)
- **Response**: Updated cart
- **Access**: Public

### DELETE /api/v1/cart/clear
Clear entire cart.
- **Query Params**: `sessionId` (required)
- **Response**: Empty cart
- **Access**: Public

---

## Orders (OrderModule)

### POST /api/v1/orders
Create a new order.
- **Body**: 
  ```json
  {
    "customerEmail": "string",
    "customerName": "string",
    "customerPhone": "string (optional)",
    "shippingAddress": "string",
    "currency": "NGN" | "USD",
    "items": [
      {
        "productId": "string",
        "quantity": number
      }
    ],
    "notes": "string (optional)",
    "sessionId": "string (optional)"
  }
  ```
- **Response**: Created order with order number
- **Access**: Public

### GET /api/v1/orders
Get all orders (admin).
- **Query Params**: 
  - `status` (optional)
  - `customerEmail` (optional)
  - `limit` (optional, default: 50)
  - `offset` (optional, default: 0)
- **Response**: `{ orders, total, limit, offset }`
- **Access**: Protected (Admin only)

### GET /api/v1/orders/stats
Get order statistics.
- **Response**: 
  ```json
  {
    "totalOrders": number,
    "pendingOrders": number,
    "paidOrders": number,
    "processingOrders": number,
    "shippedOrders": number,
    "deliveredOrders": number,
    "totalRevenue": {
      "NGN": number,
      "USD": number
    }
  }
  ```
- **Access**: Protected (Admin only)

### GET /api/v1/orders/number/:orderNumber
Get order by order number.
- **Response**: Order details
- **Access**: Public (customers can track their order)

### GET /api/v1/orders/:id
Get order by ID.
- **Response**: Order details
- **Access**: Protected (Admin only)

### PATCH /api/v1/orders/:id/status
Update order status.
- **Body**: 
  ```json
  {
    "status": "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED",
    "paymentRef": "string (optional)"
  }
  ```
- **Response**: Updated order
- **Access**: Protected (Admin only)

---

## Authentication Headers

For protected endpoints, include:
```
Authorization: Bearer <accessToken>
```

## Admin Credentials (Seeded)
- **Email**: support@kolaqalagbo.org
- **Password**: Lallana99$ (⚠️ Change after first login!)

---

---

## Notifications (NotificationModule)

### POST /api/v1/notifications/send
Send a notification manually.
- **Body**: 
  ```json
  {
    "type": "EMAIL" | "SMS" | "WHATSAPP",
    "recipient": "string",
    "subject": "string (optional)",
    "message": "string",
    "metadata": {} (optional)
  }
  ```
- **Response**: Created notification
- **Access**: Protected (Admin only)

### POST /api/v1/notifications/order/:orderId/confirmation
Send order confirmation email.
- **Response**: Notification record
- **Access**: Protected (Admin only)
- **Note**: Automatically sent on order creation

### POST /api/v1/notifications/order/:orderId/status-update
Send order status update email.
- **Body**: 
  ```json
  {
    "status": "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
    "message": "string (optional)"
  }
  ```
- **Response**: Notification record
- **Access**: Protected (Admin only)
- **Note**: Automatically sent on order status update

### GET /api/v1/notifications
Get all notifications with filters.
- **Query Params**: 
  - `type` (optional) - EMAIL, SMS, WHATSAPP
  - `status` (optional) - PENDING, SENT, FAILED, DELIVERED
  - `recipient` (optional)
  - `limit` (optional, default: 50)
  - `offset` (optional, default: 0)
- **Response**: `{ notifications, total, limit, offset }`
- **Access**: Protected (Admin only)

### GET /api/v1/notifications/stats
Get notification statistics.
- **Response**: 
  ```json
  {
    "totalNotifications": number,
    "sentNotifications": number,
    "failedNotifications": number,
    "pendingNotifications": number,
    "byType": {
      "email": number,
      "sms": number,
      "whatsapp": number
    },
    "successRate": "percentage%"
  }
  ```
- **Access**: Protected (Admin only)

---

## Email Templates

### Order Confirmation
Beautiful HTML email with:
- Order number
- Items purchased with quantities and prices
- Subtotal, shipping, and total
- Shipping address
- Brand styling

### Order Status Update
Styled email notifications for:
- Payment confirmed
- Order processing
- Order shipped
- Order delivered
- Order cancelled

---

## Payment Integration (Coming Soon)
The backend is ready for Paystack (NGN) and Stripe (USD) integration. Payment webhook handlers will be added when API keys are available.

---

## Notification Configuration

**Resend (Email)**
- Set `RESEND_API_KEY` in environment variables
- Set `FROM_EMAIL` (default: noreply@kolaqbitters.com)
- Email templates included

**SMS (Twilio - Coming Soon)**
- Will require Twilio API credentials

**WhatsApp Business API (Coming Soon)**
- Will require WhatsApp Business API credentials

---

## Admin Dashboard (AdminModule)

### GET /api/v1/admin/dashboard
Get dashboard overview with key metrics.
- **Response**: 
  ```json
  {
    "overview": {
      "totalProducts": number,
      "totalOrders": number,
      "totalCustomers": number,
      "revenue": { "NGN": number, "USD": number },
      "ordersLast30Days": number,
      "ordersLast7Days": number
    },
    "recentOrders": Order[],
    "lowStockProducts": Product[],
    "notifications": NotificationStats
  }
  ```
- **Access**: Protected (Admin only)

### GET /api/v1/admin/analytics
Get sales analytics and trends.
- **Query Params**: `days` (optional, default: 30)
- **Response**: Daily stats, revenue, average order value
- **Access**: Protected (Admin only)

### GET /api/v1/admin/top-products
Get top-selling products.
- **Query Params**: `limit` (optional, default: 10)
- **Response**: Products with total sales and order count
- **Access**: Protected (Admin only)

### GET /api/v1/admin/customer-insights
Get customer behavior analytics.
- **Response**: 
  ```json
  {
    "totalCustomers": number,
    "repeatCustomers": number,
    "repeatRate": "percentage%",
    "topCustomers": Customer[]
  }
  ```
- **Access**: Protected (Admin only)

### POST /api/v1/admin/broadcast
Send broadcast email to customer segments.
- **Body**: 
  ```json
  {
    "subject": "string",
    "message": "string (HTML)",
    "filter": "all" | "recent-customers" | "high-value",
    "recipients": ["email1", "email2"] (optional)
  }
  ```
- **Response**: Broadcast results with success/failure counts
- **Access**: Protected (Admin only)

### GET /api/v1/admin/activity
Get activity logs with filters.
- **Query Params**: 
  - `type` (optional)
  - `userId` (optional)
  - `userEmail` (optional)
  - `startDate` (optional)
  - `endDate` (optional)
  - `limit` (optional, default: 50)
  - `offset` (optional, default: 0)
- **Response**: `{ logs, total, limit, offset }`
- **Access**: Protected (Admin only)

### GET /api/v1/admin/activity/stats
Get activity statistics.
- **Response**: Total activities, today's count, breakdown by type
- **Access**: Protected (Admin only)

### POST /api/v1/admin/activity/log
Log an admin activity.
- **Body**: 
  ```json
  {
    "type": "PRODUCT_CREATED" | "PRODUCT_UPDATED" | etc.,
    "action": "string",
    "description": "string (optional)",
    "metadata": {} (optional)
  }
  ```
- **Response**: Created activity log
- **Access**: Protected (Admin only)
- **Note**: Auto-captures user info, IP, user agent

---

## Total API Endpoints: 40

**6 Modules:**
1. Auth (3 endpoints)
2. Catalog (8 endpoints)
3. Inventory (5 endpoints)
4. Cart (5 endpoints)
5. Orders (6 endpoints)
6. Notifications (5 endpoints)
7. Admin Dashboard (8 endpoints) ✨ NEW
