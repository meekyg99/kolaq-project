# Inventory Reconciliation System

## Overview
The inventory reconciliation system automatically tracks stock levels, detects low stock situations, and provides alerts to administrators. It runs as a background job using BullMQ and Redis.

## Features

### 1. Automated Reconciliation
- **Scheduled Job**: Runs daily at 2:00 AM
- **Process**: Calculates current stock by summing all inventory events for each product
- **Output**: Activity logs and email reports

### 2. Low Stock Detection
- **Scheduled Job**: Runs daily at 8:00 AM
- **Default Threshold**: 10 units
- **Alerts**: Email notifications to admin
- **Status Levels**:
  - `ok`: Stock above threshold
  - `low`: Stock at or below threshold but above 0
  - `out_of_stock`: Stock is 0

### 3. Manual Triggers
Admins can manually trigger reconciliation jobs via API endpoints.

## API Endpoints

### POST /api/v1/inventory/reconcile
Manually trigger inventory reconciliation.

**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "productId": "optional-product-id",  // If omitted, reconciles all products
  "threshold": 10                       // Optional, default is 10
}
```

**Response**:
```json
{
  "message": "Inventory reconciliation job queued",
  "jobId": "job-uuid",
  "productId": "product-id or 'all'"
}
```

### POST /api/v1/inventory/check-low-stock
Manually trigger low stock check.

**Auth Required**: Yes (Admin only)

**Response**:
```json
{
  "message": "Low stock check job queued",
  "jobId": "job-uuid"
}
```

### GET /api/v1/inventory/summary
Get overall inventory statistics.

**Auth Required**: Yes (Admin only)

**Response**:
```json
{
  "totalProducts": 50,
  "totalStock": 1234,
  "lowStockCount": 5,
  "outOfStockCount": 2,
  "lowStockThreshold": 10
}
```

### GET /api/v1/inventory/low-stock
Get list of products with low stock.

**Auth Required**: Yes (Admin only)

**Response**:
```json
[
  {
    "id": "product-id",
    "name": "Product Name",
    "slug": "product-slug",
    "category": "Bitters",
    "currentStock": 5
  }
]
```

## Background Job Details

### Reconciliation Job
**Queue**: `inventory`
**Job Name**: `reconcile`

**Process**:
1. Fetch all products (or specific product if productId provided)
2. For each product:
   - Sum all inventory events (delta values)
   - Determine stock status (ok/low/out_of_stock)
   - Create activity log entry
3. If issues found, send consolidated email report
4. Return reconciliation report with all product statuses

**Retry Policy**:
- Attempts: 3
- Backoff: Exponential (5s, 25s, 125s)

### Low Stock Check Job
**Queue**: `inventory`
**Job Name**: `low-stock-check`

**Process**:
1. Fetch all products
2. Calculate current stock for each
3. Identify products at or below threshold
4. Send single consolidated email to admin with all low stock items

**Retry Policy**:
- Attempts: 3
- Backoff: Exponential (5s, 25s, 125s)

## Email Notifications

### Reconciliation Report Email
**Subject**: `Inventory Alert: X Out of Stock, Y Low Stock`

**Content**:
- Section for out-of-stock items (red highlight)
- Section for low stock items (orange highlight)
- List of product names and current stock levels
- Call to action to restock

**Recipient**: ADMIN_EMAIL from environment variables

### Low Stock Alert Email
**Subject**: `Low Stock Alert`

**Content**:
- List of products below threshold
- Current stock levels
- HTML formatted for readability

**Recipient**: ADMIN_EMAIL from environment variables

## Activity Logging

All reconciliation events are logged to the `ActivityLog` table:

```typescript
{
  type: 'INVENTORY_ADJUSTED',
  action: 'inventory.reconciled',
  description: 'Reconciled Product Name: 25 units (ok)',
  metadata: {
    productId: 'product-id',
    productName: 'Product Name',
    calculatedStock: 25,
    status: 'ok',
    threshold: 10
  }
}
```

## Configuration

### Environment Variables
```env
ADMIN_EMAIL=admin@kolaqbitters.com
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=your-resend-api-key
```

### Scheduler Configuration
Located in: `src/jobs/schedulers/inventory.scheduler.ts`

```typescript
// Daily reconciliation at 2 AM
@Cron(CronExpression.EVERY_DAY_AT_2AM)

// Daily low stock check at 8 AM
@Cron(CronExpression.EVERY_DAY_AT_8AM)
```

## Customization

### Change Threshold
Modify the threshold in multiple places:

1. **InventoryService** (default for service):
   ```typescript
   private readonly LOW_STOCK_THRESHOLD = 10;
   ```

2. **API Request** (per reconciliation):
   ```json
   { "threshold": 20 }
   ```

### Change Schedule
Edit `src/jobs/schedulers/inventory.scheduler.ts`:

```typescript
@Cron('0 3 * * *')  // 3 AM daily
async scheduleInventoryReconciliation() { ... }
```

### Customize Email Templates
Edit email HTML in `src/jobs/processors/inventory.processor.ts`:

```typescript
private async sendReconciliationReport(...) {
  let alertHtml = '<h2>Your Custom Template</h2>';
  // ... customize here
}
```

## Monitoring

### Check Job Status
Use Redis CLI or BullMQ Dashboard to monitor:

```bash
# List all jobs
redis-cli KEYS "bull:inventory:*"

# Check failed jobs
redis-cli LRANGE "bull:inventory:failed" 0 -1
```

### Application Logs
All jobs log their progress:

```
[InventoryProcessor] Processing inventory reconciliation job abc123
[InventoryProcessor] Reconciliation found 3 low stock and 1 out of stock items
[InventoryProcessor] Inventory reconciliation job abc123 completed. Processed 50 products.
```

## Integration with Order System

When orders are fulfilled, inventory should be automatically adjusted:

```typescript
// In order fulfillment logic
await inventoryService.adjustInventory({
  productId: orderItem.productId,
  delta: -orderItem.quantity,  // Negative for reduction
  reason: `Order ${order.orderNumber} fulfilled`,
  actorEmail: 'system@kolaqbitters.com'
});
```

This triggers:
1. Immediate stock update
2. Low stock check if below threshold
3. Activity log entry
4. Next scheduled reconciliation will verify

## Best Practices

1. **Regular Reconciliation**: Keep the daily schedule to catch discrepancies
2. **Manual Verification**: Periodically trigger manual reconciliation after major operations
3. **Monitor Alerts**: Act quickly on out-of-stock notifications
4. **Audit Trail**: Review activity logs regularly for unusual patterns
5. **Threshold Tuning**: Adjust LOW_STOCK_THRESHOLD based on sales velocity

## Troubleshooting

### Jobs Not Running
1. Check Redis connection: `REDIS_URL` in .env
2. Verify BullMQ module is imported in app.module
3. Check logs for scheduler errors

### No Email Alerts
1. Verify `RESEND_API_KEY` is set
2. Check `ADMIN_EMAIL` is configured
3. Look for email job failures in logs

### Incorrect Stock Calculations
1. Review inventory events: `GET /api/v1/inventory/history`
2. Trigger manual reconciliation: `POST /api/v1/inventory/reconcile`
3. Check for duplicate or missing events in database

## Future Enhancements

- [ ] Web dashboard for real-time inventory monitoring
- [ ] Predictive low stock alerts based on sales trends
- [ ] Multi-location inventory tracking
- [ ] Automated reorder suggestions
- [ ] SMS/WhatsApp alerts in addition to email
- [ ] Export reconciliation reports to CSV/PDF
- [ ] Inventory forecasting and analytics
