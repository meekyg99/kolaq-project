-- Manual Migration Part 2: Add new OrderStatus enum values
-- Date: 2025-12-02
-- NOTE: These must be run OUTSIDE of a transaction
-- Run each line separately, one at a time

-- Add new status values
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_PENDING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'READY_FOR_DISPATCH';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'DISPATCHED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'IN_TRANSIT';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'OUT_FOR_DELIVERY';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'FAILED';

-- Verify enum values
SELECT unnest(enum_range(NULL::("OrderStatus"))) as status_value;
