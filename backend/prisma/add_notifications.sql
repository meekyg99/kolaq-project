-- Add Notification table

-- Create NotificationType enum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- Create NotificationStatus enum  
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'DELIVERED');

-- Create Notification table
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Create indexes for better query performance
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
CREATE INDEX "Notification_status_idx" ON "Notification"("status");
CREATE INDEX "Notification_recipient_idx" ON "Notification"("recipient");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
