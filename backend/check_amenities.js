import { prisma } from './src/databases/init.mongodb.js';

async function main() {
    const amenities = await prisma.restaurant_Amenities.findMany();
    console.log(JSON.stringify(amenities, null, 2));
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
