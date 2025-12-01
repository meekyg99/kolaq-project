const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user with secure password
  const password = 'Lallana99$';
  const passcodeHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: 'support@kolaqalagbo.org' },
    update: {
      passcodeHash: passcodeHash,
      name: 'Admin',
      role: 'admin',
    },
    create: {
      email: 'support@kolaqalagbo.org',
      name: 'Admin',
      role: 'admin',
      passcodeHash: passcodeHash,
    },
  });

  console.log('Admin user created/updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
