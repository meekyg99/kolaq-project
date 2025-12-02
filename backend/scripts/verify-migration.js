const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('🔍 Verifying migration...\n');
    
    // Check Order table columns
    const orderColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
        AND column_name IN ('shippingState', 'shippingLGA', 'actualDelivery', 'deliveryNotes', 'deliveredBy')
      ORDER BY column_name
    `;
    console.log('✅ New Order columns:', orderColumns.length, '/', 5);
    orderColumns.forEach(col => console.log('   -', col.column_name));
    
    // Check OrderStatusHistory table
    const historyExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'OrderStatusHistory'
      )
    `;
    console.log('\n✅ OrderStatusHistory table exists:', historyExists[0].exists);
    
    // Check OrderStatus enum values
    const enumValues = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::("OrderStatus")))::text as status_value
      ORDER BY status_value
    `;
    console.log('\n✅ OrderStatus enum values:', enumValues.length, '/', 12);
    enumValues.forEach(val => console.log('   -', val.status_value));
    
    // Check indexes
    const indexes = await prisma.$queryRaw`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename IN ('Order', 'OrderStatusHistory')
      ORDER BY indexname
    `;
    console.log('\n✅ Indexes created:', indexes.length);
    
    // Count orders
    const orderCount = await prisma.order.count();
    console.log('\n📊 Total orders:', orderCount);
    
    // Check if we can query status history
    const historyCount = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "OrderStatusHistory"`;
    console.log('📊 Status history entries:', historyCount[0].count);
    
    console.log('\n✨ Migration verification complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart backend server');
    console.log('2. Test order tracking endpoint: GET /api/v1/orders/track/{orderNumber}');
    console.log('3. Create a test order and check status history');
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
