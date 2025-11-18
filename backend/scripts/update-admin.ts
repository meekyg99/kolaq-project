import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Admin password update script
const prisma = new PrismaClient();

async function updateAdminPassword() {
  const adminEmail = 'admin@kolaqbitters.com';
  const newPasscode = 'Herbal#2025';

  try {
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      console.log('Creating new admin...');
      const passcodeHash = await bcrypt.hash(newPasscode, 10);
      
      await prisma.adminUser.create({
        data: {
          email: adminEmail,
          name: 'Admin User',
          role: 'admin',
          passcodeHash,
        },
      });
    } else {
      const passcodeHash = await bcrypt.hash(newPasscode, 10);
      
      await prisma.adminUser.update({
        where: { email: adminEmail },
        data: { passcodeHash },
      });
      
      console.log('Updated admin password');
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
