const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTable() {
  try {
    console.log('Creating OrderStatusHistory table...');
    
    // Create table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
        "id" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "status" "OrderStatus" NOT NULL,
        "note" TEXT,
        "createdBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
      )
    `);
    console.log('✅ Table created');
    
    // Add foreign key
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "OrderStatusHistory" 
      ADD CONSTRAINT IF NOT EXISTS "OrderStatusHistory_orderId_fkey" 
      FOREIGN KEY ("orderId") REFERENCES "Order"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `).catch(e => console.log('FK exists or error:', e.message));
    
    // Create indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory"("orderId")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "OrderStatusHistory_createdAt_idx" ON "OrderStatusHistory"("createdAt")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_customerEmail_idx" ON "Order"("customerEmail")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt")`);
    console.log('✅ Indexes created');
    
    // Add new columns to Order
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingState" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "shippingLGA" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "actualDelivery" TIMESTAMP(3)`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryNotes" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveredBy" TEXT`);
    console.log('✅ New columns added');
    
    console.log('\n✨ Migration completed!');
    console.log('Run: npx prisma generate');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTable();
