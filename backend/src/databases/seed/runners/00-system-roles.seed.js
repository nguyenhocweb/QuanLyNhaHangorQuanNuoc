import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 00: Khởi tạo Master Data Hệ Thống từ data/system_master_data.json
 */
export const seedSystemRoles = async () => {
    console.log("👉 [0/5] Khởi tạo Master Data Hệ Thống (từ data/system_master_data.json)...");

    // 1. Đọc dữ liệu từ data/system_master_data.json
    const masterDataPath = new URL("../data/system_master_data.json", import.meta.url);
    const masterData = JSON.parse(fs.readFileSync(masterDataPath, "utf-8"));

    // 1. System Roles
    for (const role of masterData.system_roles) {
        await prisma.systemRole.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: { name: role.name, description: role.description }
        });
    }

    // 2. Workspace Roles
    for (const role of masterData.workspace_roles) {
        await prisma.workspaceRole.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: { name: role.name, description: role.description }
        });
    }

    // 3. Permissions
    for (const perm of masterData.permissions) {
        const existing = await prisma.permission.findFirst({ where: { name: perm.name } });
        if (!existing) {
            await prisma.permission.create({
                data: { name: perm.name, description: perm.description, type: perm.type }
            });
        }
    }

    // 4. Subscription Plans
    for (const plan of masterData.subscription_plans) {
        await prisma.subscriptionPlan.upsert({
            where: { name: plan.name },
            update: {
                featuresData: plan.featuresData,
                price: plan.price,
                maxRestaurants: plan.maxRestaurants,
                isActive: plan.isActive
            },
            create: {
                name: plan.name,
                description: plan.description,
                price: plan.price,
                billingCycle: plan.billingCycle,
                maxRestaurants: plan.maxRestaurants,
                featuresData: plan.featuresData,
                isPublic: plan.isPublic,
                isActive: plan.isActive
            }
        });
    }

    // 5. Categories
    for (const cat of masterData.categories) {
        await prisma.category_Restaurant.upsert({
            where: { name: cat.name },
            update: { icon: cat.icon || null, bgColor: cat.bgColor, textColor: cat.textColor },
            create: { name: cat.name, icon: cat.icon || null, bgColor: cat.bgColor, textColor: cat.textColor, isActive: true }
        });
    }

    // 6. Tags
    for (const tag of masterData.tags) {
        await prisma.tags.upsert({
            where: { slug: tag.slug },
            update: { name: tag.name },
            create: { name: tag.name, slug: tag.slug }
        });
    }

    // 7. Amenities
    for (const amenity of masterData.amenities) {
        await prisma.restaurant_Amenities.upsert({
            where: { name: amenity.name },
            update: { icon: amenity.icon },
            create: { name: amenity.name, icon: amenity.icon }
        });
    }

    // 8. Templates
    for (const tpl of masterData.templates) {
        await prisma.template.upsert({
            where: { code: tpl.code },
            update: { name: tpl.name, type: tpl.type },
            create: { code: tpl.code, name: tpl.name, type: tpl.type, isActive: true }
        });
    }

    // 9. System Payment Methods
    for (const method of masterData.system_payment_methods) {
        await prisma.systemPaymentMethod.upsert({
            where: { code: method.code },
            update: { name: method.name, description: method.description },
            create: { name: method.name, code: method.code, description: method.description, isActive: true }
        });
    }

    console.log("✅ Đã khởi tạo hoàn tất Master Data từ data/system_master_data.json!");
    return true;
};
