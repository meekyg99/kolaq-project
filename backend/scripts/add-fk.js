const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addFK() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "OrderStatusHistory" 
      ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" 
      FOREIGN KEY ("orderId") 
      REFERENCES "Order"("id") 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
    `);
    console.log('✅ Foreign key constraint added');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Foreign key already exists');
    } else {
      console.log('Note:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addFK();
