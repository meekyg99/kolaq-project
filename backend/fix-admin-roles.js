const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAdminRoles() {
  try {
    console.log('Updating admin roles from "superadmin" to "admin"...\n');
    
    const result = await prisma.adminUser.updateMany({
      where: {
        role: 'superadmin'
      },
      data: {
        role: 'admin'
      }
    });
    
    console.log(`✅ Updated ${result.count} admin user(s)\n`);
    
    // Verify the changes
    const admins = await prisma.adminUser.findMany();
    console.log('Current admin users:');
    admins.forEach(admin => {
      console.log(`  - ${admin.email}: role="${admin.role}"`);
    });
    
  } catch (error) {
    console.error('❌ Error updating admin roles:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRoles();
