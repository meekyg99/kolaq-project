# Analytics & Inventory Forecasting

## Overview
Complete analytics and inventory forecasting system for Kolaq Bitters admin dashboard.

## Features Implemented

### 1. Sales Analytics (`GET /api/v1/admin/analytics/sales`)
**Query Parameters:**
- `range`: today | week | month | quarter | year | custom (default: month)
- `startDate`: ISO date string (for custom range)
- `endDate`: ISO date string (for custom range)

**Returns:**
```json
{
  "summary": {
    "totalRevenue": 1250000.00,
    "totalOrders": 145,
    "averageOrderValue": 8620.69,
    "totalItems": 432,
    "currencyBreakdown": {
      "NGN": 950000.00,
      "USD": 300000.00
    }
  },
  "dailySales": [
    {
      "date": "2025-11-01",
      "revenue": 45000.00,
      "orders": 8
    }
  ],
  "period": {
    "startDate": "2025-10-17T00:00:00.000Z",
    "endDate": "2025-11-17T08:42:16.480Z"
  }
}
```

### 2. Product Performance (`GET /api/v1/admin/analytics/products`)
**Query Parameters:** Same as sales analytics

**Returns:**
```json
[
  {
    "product": {
      "id": "cm3l1dj5c0000tx4ylkl4xoz5",
      "name": "Kolaq Bitters Original",
      "category": "bitters",
      "image": "https://..."
    },
    "unitsSold": 234,
    "orderCount": 89,
    "revenue": 456000.00
  }
]
```
- Top 20 products by revenue
- Includes units sold, order count, and revenue per product

### 3. Inventory Status (`GET /api/v1/admin/analytics/inventory`)
**Returns:**
```json
{
  "summary": {
    "totalProducts": 12,
    "inStock": 8,
    "lowStock": 3,
    "outOfStock": 1
  },
  "inventory": [
    {
      "id": "product-id",
      "name": "Product Name",
      "category": "bitters",
      "totalStock": 45,
      "variants": [
        {
          "id": "variant-id",
          "name": "200ml",
          "bottleSize": "200ml",
          "stock": 45,
          "status": "IN_STOCK"
        }
      ],
      "status": "IN_STOCK",
      "eventsCount": 12
    }
  ]
}
```

**Stock Status:**
- `OUT_OF_STOCK`: 0 units
- `LOW_STOCK`: ≤10 units
- `IN_STOCK`: >10 units

### 4. Inventory Forecasting (`GET /api/v1/admin/analytics/forecast`)
**Query Parameters:**
- `days`: Number of days to forecast (default: 30)
- `productId`: Optional - forecast specific product

**Returns:**
```json
{
  "forecastPeriodDays": 30,
  "lookbackPeriodDays": 60,
  "forecasts": [
    {
      "productId": "cm3l1dj5c0000tx4ylkl4xoz5",
      "productName": "Kolaq Bitters Original",
      "currentStock": 45,
      "dailyAverageSales": 3.25,
      "forecastedDemand": 98,
      "projectedStockoutDays": 13,
      "reorderPoint": 23,
      "needsReorder": false,
      "recommendedOrderQuantity": 0
    }
  ]
}
```

**Forecasting Algorithm:**
- Uses 2x lookback period (60 days for 30-day forecast)
- Calculates daily average sales from historical data
- Projects stockout date based on current inventory
- Reorder point = 7 days of average sales
- Recommended order = forecasted demand + reorder point - current stock
- Results sorted by urgency (products needing reorder first)

### 5. Customer Metrics (`GET /api/v1/admin/analytics/customers`)
**Query Parameters:** Same as sales analytics

**Returns:**
```json
{
  "uniqueCustomers": 87,
  "returningCustomers": 23,
  "newCustomers": 64,
  "averageCustomerValue": 14367.82,
  "retentionRate": 26.44
}
```

## Use Cases

### Dashboard Overview
1. Display sales metrics for quick overview
2. Show top-performing products
3. Highlight low stock alerts

### Inventory Management
1. Monitor stock levels across all products and variants
2. Get automated reorder recommendations
3. Predict when products will run out
4. Optimize purchasing decisions

### Business Intelligence
1. Track revenue trends over time
2. Identify best-selling products
3. Analyze customer retention
4. Compare performance across time periods

### Automated Alerts
- Set up notifications when products hit reorder point
- Alert on projected stockouts
- Track daily/weekly/monthly KPIs

## Authentication
All analytics endpoints require:
- Valid JWT token
- Admin role

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Testing Endpoints

### Get Monthly Sales
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/analytics/sales?range=month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get 60-Day Inventory Forecast
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/analytics/forecast?days=60" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Inventory Status
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/analytics/inventory" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Product Performance (Last Quarter)
```bash
curl -X GET "https://kolaq-project-production.up.railway.app/api/v1/admin/analytics/products?range=quarter" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

### Frontend Integration
1. Create analytics dashboard page
2. Add charts/graphs for visual representation
3. Implement real-time updates
4. Add export functionality (CSV/PDF)

### Advanced Features
1. Predictive analytics with ML models
2. Seasonal trend analysis
3. Multi-currency conversion
4. Custom report builder
5. Scheduled email reports

### Optimization
1. Cache frequently accessed metrics
2. Pre-calculate daily aggregates
3. Use background jobs for complex calculations
4. Add query result pagination

## Database Considerations
- Queries use indexes on `createdAt`, `productId`, and `status`
- Consider adding materialized views for large datasets
- Archive old orders to maintain performance
- Add read replicas for analytics queries

## Status
✅ Sales analytics
✅ Product performance tracking
✅ Inventory status monitoring
✅ Inventory forecasting with reorder recommendations
✅ Customer metrics and retention analysis
✅ Time range filtering (today/week/month/quarter/year/custom)
✅ Multi-currency support
✅ Admin authentication and authorization

Ready for production use!
