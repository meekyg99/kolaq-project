-- Manual Migration: Add Order Tracking and Status History
-- Date: 2025-12-02
-- WARNING: Run this on a backup first!

BEGIN;

-- Step 1: Add new columns to Order table
ALTER TABLE "Order" 
  ADD COLUMN IF NOT EXISTS "shippingState" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingLGA" TEXT,
  ADD COLUMN IF NOT EXISTS "actualDelivery" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "deliveryNotes" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveredBy" TEXT;

-- Step 2: Create OrderStatusHistory table
CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "status" "OrderStatus" NOT NULL,
  "note" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- Step 3: Add foreign key
ALTER TABLE "OrderStatusHistory" 
  ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" 
  FOREIGN KEY ("orderId") 
  REFERENCES "Order"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory"("orderId");
CREATE INDEX IF NOT EXISTS "OrderStatusHistory_createdAt_idx" ON "OrderStatusHistory"("createdAt");
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS "Order_customerEmail_idx" ON "Order"("customerEmail");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");

-- Step 5: Populate initial status history for existing orders
INSERT INTO "OrderStatusHistory" ("id", "orderId", "status", "note", "createdBy", "createdAt")
SELECT 
  'hist-' || gen_random_uuid()::text,
  "id",
  "status",
  'Initial status from migration',
  'SYSTEM',
  "createdAt"
FROM "Order"
WHERE NOT EXISTS (
  SELECT 1 FROM "OrderStatusHistory" WHERE "orderId" = "Order"."id"
);

COMMIT;

-- Verify migration
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as total_orders FROM "Order";
SELECT COUNT(*) as total_history FROM "OrderStatusHistory";
