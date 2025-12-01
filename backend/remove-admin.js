const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeAdmin() {
  try {
    const email = 'admin@kolaqbitters.com';
    
    console.log(`Removing ${email} from AdminUser and User tables...\n`);
    
    // Remove from AdminUser table
    const deletedAdmin = await prisma.adminUser.deleteMany({
      where: { email: email }
    });
    
    console.log(`✅ Removed from AdminUser: ${deletedAdmin.count} record(s)`);
    
    // Remove from User table
    const deletedUser = await prisma.user.deleteMany({
      where: { email: email }
    });
    
    console.log(`✅ Removed from User: ${deletedUser.count} record(s)\n`);
    
    // Verify removal
    console.log('Verifying removal...');
    const checkAdmin = await prisma.adminUser.findUnique({
      where: { email: email }
    });
    
    const checkUser = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!checkAdmin && !checkUser) {
      console.log(`✅ Confirmed: ${email} has been completely removed\n`);
    } else {
      console.log(`⚠️  Warning: ${email} may still exist in some tables\n`);
    }
    
    // Show remaining admin users
    const remainingAdmins = await prisma.adminUser.findMany();
    console.log('Remaining admin users:');
    remainingAdmins.forEach(admin => {
      console.log(`  - ${admin.email} (${admin.role})`);
    });
    
  } catch (error) {
    console.error('❌ Error removing admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

removeAdmin();
