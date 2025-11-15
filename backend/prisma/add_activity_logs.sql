-- Add Activity Logging

-- Create ActivityType enum
CREATE TYPE "ActivityType" AS ENUM (
  'LOGIN',
  'LOGOUT',
  'PRODUCT_CREATED',
  'PRODUCT_UPDATED',
  'PRODUCT_DELETED',
  'INVENTORY_ADJUSTED',
  'ORDER_STATUS_UPDATED',
  'NOTIFICATION_SENT',
  'SETTINGS_CHANGED'
);

-- Create ActivityLog table
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for better query performance
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX "ActivityLog_type_idx" ON "ActivityLog"("type");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
