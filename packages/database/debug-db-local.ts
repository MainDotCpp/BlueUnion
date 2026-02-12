import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const count = await prisma.products.count();
    console.log(`Product count: ${count}`);

    if (count > 0) {
      const products = await prisma.products.findMany({
        take: 2,
        select: { id: true, name: true, price: true },
      });
      console.log('Sample products:', JSON.stringify(products, null, 2));
    } else {
      console.log('No products found in database.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
