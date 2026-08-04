import { prisma } from "./src/databases/init.mongodb.js";

async function main() {
    const brandId = "aa5630cce710a77bd9016886";
    const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        select: {
            restaurantCount: true,
            subscriptions: {
                include: {
                    plan: true
                }
            }
        }
    });
    console.log(JSON.stringify(brand, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
