import { prisma } from './src/databases/init.mongodb.js';

async function main() {
    const r = await prisma.restaurant.findFirst();
    if (!r) {
        console.log("No restaurant found");
        return;
    }
    console.log("Old Address:", r.address);
    try {
        const updated = await prisma.restaurant.update({
            where: { id: r.id },
            data: {
                address: {
                    province: "Test Province",
                    district: "Test District"
                }
            }
        });
        console.log("New Address:", updated.address);
    } catch (e) {
        console.error("Error updating address:", e.message);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
