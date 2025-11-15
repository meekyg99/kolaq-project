import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = 'admin@kolaqbitters.com';
  const adminPasscode = 'admin123'; // Change this in production

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  const passcodeHash = await bcrypt.hash(adminPasscode, 10);

  const admin = await prisma.adminUser.create({
    data: {
      email: adminEmail,
      name: 'Admin User',
      role: 'admin',
      passcodeHash,
    },
  });

  console.log('✅ Created admin user:', admin.email);
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Passcode:', adminPasscode);
  console.log('⚠️  Please change the passcode after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
