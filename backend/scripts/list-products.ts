import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      image: true,
    },
  });

  console.log('📦 Products in database:\n');
  if (products.length === 0) {
    console.log('   No products found!');
  } else {
    for (const p of products) {
      console.log(`   ${p.name}`);
      console.log(`     Slug: ${p.slug}`);
      console.log(`     Image: ${p.image || '(none)'}`);
      console.log('');
    }
  }
  console.log(`Total: ${products.length} products`);
}

listProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
