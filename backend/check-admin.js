const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admins = await prisma.adminUser.findMany();
    console.log('Admin users found:', JSON.stringify(admins, null, 2));
    
    if (admins.length === 0) {
      console.log('\nNo admin users found in database!');
    } else {
      admins.forEach(admin => {
        console.log(`\n--- Admin: ${admin.email} ---`);
        console.log(`ID: ${admin.id}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Role: ${admin.role}`);
        console.log(`Created: ${admin.createdAt}`);
      });
    }
  } catch (error) {
    console.error('Error checking admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
