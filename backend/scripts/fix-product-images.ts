import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProductImages() {
  console.log('🖼️  Fixing product images...\n');

  // Get all products
  const products = await prisma.product.findMany();

  // Available images in frontend/public/images/products/
  const availableImages = [
    '/images/products/essence-bitter.jpg',
    '/images/products/noir-botanica.jpg',
    '/images/products/velvet-root.jpg',
  ];

  let index = 0;
  for (const product of products) {
    const newImage = availableImages[index % availableImages.length];
    
    await prisma.product.update({
      where: { id: product.id },
      data: { image: newImage },
    });
    
    console.log(`✅ Updated "${product.name}" -> ${newImage}`);
    index++;
  }

  console.log(`\n✨ Fixed ${products.length} products!`);
}

fixProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
