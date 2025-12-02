/**
 * Apply manual migration to Railway database
 * Run with: node scripts/apply-migration.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigration() {
  console.log('🚀 Starting database migration...\n');

  try {
    // Step 1: Read SQL file
    const sqlPath = path.join(__dirname, '../prisma/migrations/manual/add_order_tracking.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 Read migration SQL file');
    
    // Step 2: Execute migration (without enum values)
    console.log('⚙️  Applying migration...');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('SELECT'));
    
    for (const statement of statements) {
      if (statement.includes('BEGIN') || statement.includes('COMMIT')) continue;
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log('✅ Executed statement');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⏭️  Skipped (already exists)');
        } else {
          console.error('❌ Error:', error.message);
        }
      }
    }
    
    // Step 3: Add enum values (these need special handling)
    console.log('\n⚙️  Adding new enum values...');
    
    const enumValues = [
      'PAYMENT_PENDING',
      'READY_FOR_DISPATCH',
      'DISPATCHED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'FAILED'
    ];
    
    for (const value of enumValues) {
      try {
        await prisma.$executeRawUnsafe(
          `ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS '${value}'`
        );
        console.log(`✅ Added enum value: ${value}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️  ${value} already exists`);
        } else {
          console.error(`❌ Error adding ${value}:`, error.message);
        }
      }
    }
    
    // Step 4: Verify migration
    console.log('\n🔍 Verifying migration...');
    
    const orderCount = await prisma.order.count();
    console.log(`✅ Total orders: ${orderCount}`);
    
    const historyCount = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "OrderStatusHistory"`;
    console.log(`✅ Total status history entries: ${historyCount[0].count}`);
    
    // Check if columns exist
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
        AND column_name IN ('shippingState', 'shippingLGA', 'actualDelivery')
    `;
    console.log(`✅ New columns added: ${columns.length}/3`);
    
    // Check enum values
    const enumCheck = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::("OrderStatus")))::text as status_value
    `;
    console.log(`✅ OrderStatus enum values: ${enumCheck.length}`);
    
    console.log('\n✨ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Restart your backend server');
    console.log('3. Test order tracking endpoint');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.log('\n🔄 You can try running the SQL manually:');
    console.log('1. Connect to Railway database');
    console.log('2. Run: backend/prisma/migrations/manual/add_order_tracking.sql');
    console.log('3. Run: backend/prisma/migrations/manual/add_enum_values.sql');
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
