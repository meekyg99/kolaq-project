# Manual Database Migration Guide

## 📋 Prerequisites

1. **Backup your database first!**
   ```bash
   pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
   ```

2. **Have database credentials ready** (from Railway dashboard)

## 🚀 How to Apply Migration

### Method 1: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway connect postgres

# In the PostgreSQL prompt:
\i backend/prisma/migrations/manual/add_order_tracking.sql
\i backend/prisma/migrations/manual/add_enum_values.sql
```

### Method 2: Using pgAdmin or DBeaver

1. Connect to your Railway PostgreSQL database
2. Open SQL Query window
3. Copy content from `add_order_tracking.sql`
4. Execute the query
5. Copy content from `add_enum_values.sql`
6. Execute **each line separately** (enum values can't be in transaction)

### Method 3: Using psql directly

```bash
# Get DATABASE_URL from Railway dashboard
# Example: postgresql://user:pass@host:port/dbname

# Connect
psql $DATABASE_URL

# Run migrations
\i backend/prisma/migrations/manual/add_order_tracking.sql

# Run enum values (one at a time)
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_PENDING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'READY_FOR_DISPATCH';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'DISPATCHED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'IN_TRANSIT';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'OUT_FOR_DELIVERY';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'FAILED';
```

## ✅ Verify Migration

After running the migration, verify it worked:

```sql
-- Check new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
  AND column_name IN ('shippingState', 'shippingLGA', 'actualDelivery');

-- Check OrderStatusHistory table exists
SELECT COUNT(*) FROM "OrderStatusHistory";

-- Check new enum values
SELECT unnest(enum_range(NULL::("OrderStatus"))) as status_value;

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'Order';
```

Expected results:
- 5 new columns in Order table
- OrderStatusHistory table with initial data
- 12 OrderStatus enum values (was 7, now 12)
- 6 new indexes created

## 🔄 After Migration

1. **Regenerate Prisma Client**
   ```bash
   cd backend
   npx prisma generate
   ```

2. **Restart Backend Server**
   ```bash
   npm run dev
   ```

3. **Test Order Tracking**
   - Create a test order
   - Update its status
   - Check `/api/v1/orders/track/{orderNumber}`
   - Verify statusHistory is populated

## 🐛 Troubleshooting

### Error: "column already exists"

This is safe - it means the column was already added. Continue with next steps.

### Error: "enum value already exists"

This is safe - it means the enum value was already added. Continue.

### Error: "relation already exists"

The table was already created. Skip table creation, run only the indexes and data population.

### Migration fails mid-way

1. Check which step failed
2. Run only the remaining steps manually
3. Use `IF NOT EXISTS` to avoid conflicts

## 🔙 Rollback (if needed)

```sql
BEGIN;

-- Drop table
DROP TABLE IF EXISTS "OrderStatusHistory";

-- Remove columns
ALTER TABLE "Order" 
  DROP COLUMN IF EXISTS "shippingState",
  DROP COLUMN IF EXISTS "shippingLGA",
  DROP COLUMN IF EXISTS "actualDelivery",
  DROP COLUMN IF EXISTS "deliveryNotes",
  DROP COLUMN IF EXISTS "deliveredBy";

-- Drop indexes
DROP INDEX IF EXISTS "OrderStatusHistory_orderId_idx";
DROP INDEX IF EXISTS "OrderStatusHistory_createdAt_idx";
DROP INDEX IF EXISTS "Order_orderNumber_idx";
DROP INDEX IF EXISTS "Order_customerEmail_idx";
DROP INDEX IF EXISTS "Order_status_idx";
DROP INDEX IF EXISTS "Order_createdAt_idx";

COMMIT;

-- Note: Enum values cannot be removed in PostgreSQL
-- You would need to recreate the entire enum type
```

## 📞 Need Help?

If migration fails:
1. Restore from backup
2. Check error messages
3. Verify database connection
4. Try running steps individually

---

**Status after successful migration:** ✅ Database ready for order tracking!
