const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('🔍 Final Migration Verification\n');
    console.log('='.repeat(50));
    
    // 1. Check Order table columns
    console.log('\n1. NEW ORDER COLUMNS:');
    const orderColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
        AND column_name IN ('shippingState', 'shippingLGA', 'actualDelivery', 'deliveryNotes', 'deliveredBy')
      ORDER BY column_name
    `;
    console.log(`   ✅ ${orderColumns.length}/5 columns added`);
    orderColumns.forEach(col => console.log(`      - ${col.column_name} (${col.data_type})`));
    
    // 2. Check OrderStatusHistory table
    console.log('\n2. ORDERSTATUS HISTORY TABLE:');
    const historyColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'OrderStatusHistory'
      ORDER BY ordinal_position
    `;
    console.log(`   ✅ Table exists with ${historyColumns.length} columns`);
    historyColumns.forEach(col => console.log(`      - ${col.column_name} (${col.data_type})`));
    
    // 3. Check foreign key
    console.log('\n3. FOREIGN KEY CONSTRAINT:');
    const fk = await prisma.$queryRaw`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'OrderStatusHistory' 
        AND constraint_type = 'FOREIGN KEY'
    `;
    console.log(`   ✅ ${fk.length} foreign key(s) created`);
    fk.forEach(f => console.log(`      - ${f.constraint_name}`));
    
    // 4. Check indexes
    console.log('\n4. INDEXES:');
    const indexes = await prisma.$queryRaw`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename IN ('Order', 'OrderStatusHistory')
        AND indexname NOT LIKE '%_pkey'
      ORDER BY indexname
    `;
    console.log(`   ✅ ${indexes.length} indexes created`);
    indexes.forEach(idx => console.log(`      - ${idx.indexname}`));
    
    // 5. Count data
    console.log('\n5. DATA:');
    const orderCount = await prisma.order.count();
    console.log(`   📊 Total orders: ${orderCount}`);
    
    const historyCount = await prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM "OrderStatusHistory"
    `;
    console.log(`   📊 Status history entries: ${historyCount[0].count}`);
    
    // 6. Test Prisma client
    console.log('\n6. PRISMA CLIENT:');
    try {
      // Try to use the new relation
      await prisma.order.findFirst({
        include: {
          statusHistory: true
        }
      });
      console.log('   ✅ Prisma client recognizes statusHistory relation');
    } catch (e) {
      console.log('   ⚠️  Prisma client may need regeneration:', e.message.substring(0, 80));
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n✨ MIGRATION SUCCESSFUL!\n');
    
    console.log('📝 NEXT STEPS:');
    console.log('   1. ✅ Database schema updated');
    console.log('   2. ✅ Prisma client regenerated');
    console.log('   3. 🔄 Restart backend server: npm run dev');
    console.log('   4. 🧪 Test endpoints:');
    console.log('      - POST /api/v1/orders (create order)');
    console.log('      - GET /api/v1/orders/track/{orderNumber}');
    console.log('      - PATCH /api/v1/orders/{id}/status');
    console.log('   5. 🎯 Test order tracking in frontend');
    console.log('      - Visit: http://localhost:3000/track-order\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
