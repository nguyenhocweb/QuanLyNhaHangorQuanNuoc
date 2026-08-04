import { prisma } from "./src/databases/init.mongodb.js";

const BRAND_TEMPLATES = [
    { code: "premium3d", name: "Cao cấp 3D", type: "BRAND_TEMPLATE" },
    { code: "standard", name: "Tiêu chuẩn", type: "BRAND_TEMPLATE" },
    { code: "luxury", name: "Sang trọng", type: "BRAND_TEMPLATE" },
    { code: "vibrant", name: "Sôi động", type: "BRAND_TEMPLATE" },
];

const RESTAURANT_TEMPLATES = [
    { code: "REST_DEFAULT", name: "Tiêu chuẩn (Mặc định)", type: "RESTAURANT_TEMPLATE" },
    { code: "REST_MINIMAL", name: "Tối giản", type: "RESTAURANT_TEMPLATE" },
    { code: "REST_LUXURY", name: "Sang trọng", type: "RESTAURANT_TEMPLATE" },
    { code: "REST_VIBRANT", name: "Sôi động", type: "RESTAURANT_TEMPLATE" },
    { code: "REST_RUSTIC", name: "Mộc mạc", type: "RESTAURANT_TEMPLATE" },
];

async function seed() {
    console.log("Seeding templates...");
    
    const allTemplates = [...BRAND_TEMPLATES, ...RESTAURANT_TEMPLATES];
    
    for (const t of allTemplates) {
        await prisma.template.upsert({
            where: { code: t.code },
            update: {
                name: t.name,
                type: t.type
            },
            create: {
                code: t.code,
                name: t.name,
                type: t.type,
                isActive: true
            }
        });
        console.log(`Upserted ${t.type} - ${t.code}`);
    }
    
    console.log("Template seeding complete!");
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
