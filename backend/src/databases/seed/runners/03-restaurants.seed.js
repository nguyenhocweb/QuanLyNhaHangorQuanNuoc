import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 03: Khởi tạo Toàn Diện 60 Chi Nhánh Nhà Hàng & Toàn bộ 7+ Table Liên Quan
 * High Performance Batch Execution (< 5s)
 */
export const seedRestaurants = async () => {
    console.log("👉 [3/5] Khởi tạo 60 Chi nhánh Nhà hàng & Toàn bộ Bảng quan hệ (Areas, Schedules, Roles)...");

    // 1. Đọc dữ liệu từ file JSON
    const restaurantsPath = new URL("../data/restaurants.json", import.meta.url);
    const restaurantsJson = JSON.parse(fs.readFileSync(restaurantsPath, "utf-8"));

    // 2. Pre-fetch toàn bộ Master Data phụ thuộc vào bộ nhớ
    const [
        restRole,
        restPermissions,
        allBrands,
        allUsers,
        allExistingRestaurants,
        allCategories,
        allTags,
        allAmenities,
        templates
    ] = await Promise.all([
        prisma.workspaceRole.findUnique({
            where: { name: "Quản lý nhà hàng" }
        }),
        prisma.permission.findMany({
            where: { type: "RESTAURANT" }
        }),
        prisma.brand.findMany({
            select: { id: true, name: true }
        }),
        prisma.user.findMany({
            select: { id: true, user_name: true }
        }),
        prisma.restaurant.findMany({
            select: { id: true, slug: true, name: true }
        }),
        prisma.category_Restaurant.findMany({
            select: { id: true }
        }),
        prisma.tags.findMany({
            select: { id: true }
        }),
        prisma.restaurant_Amenities.findMany({
            select: { id: true }
        }),
        prisma.template.findMany({
            where: { type: "RESTAURANT_TEMPLATE" }
        })
    ]);

    if (!restRole) {
        throw new Error("Lỗi: Không tìm thấy WorkspaceRole 'Quản lý nhà hàng'");
    }

    const brandMap = new Map(allBrands.map(b => [b.name, b.id]));
    const userMap = new Map(allUsers.map(u => [u.user_name, u.id]));
    const restMap = new Map(allExistingRestaurants.map(r => [r.slug, r.id]));
    const defaultTemplateId = templates[0]?.id || null;

    const categoryIds = allCategories.map(c => c.id).slice(0, 3);
    const tagIds = allTags.map(t => t.id).slice(0, 4);
    const amenityIds = allAmenities.map(a => a.id).slice(0, 5);

    // Pre-fetch Employments
    const allEmployments = await prisma.employment.findMany({
        where: { restaurantId: { not: null } },
        select: { id: true, userId: true, restaurantId: true }
    });
    const employmentSet = new Map(allEmployments.map(e => [`${e.userId}_${e.restaurantId}`, e.id]));

    // Pre-fetch Areas
    const allAreas = await prisma.restaurant_Areas.findMany({
        select: { id: true, restaurantId: true, name: true }
    });
    const areaSet = new Set(allAreas.map(a => `${a.restaurantId}_${a.name}`));

    // Pre-fetch Operating Hours
    const allOpHours = await prisma.operating_Hours.findMany({
        select: { id: true, restaurantId: true, day_of_week: true }
    });
    const opHourSet = new Set(allOpHours.map(o => `${o.restaurantId}_${o.day_of_week}`));

    // Pre-fetch Special Schedules
    const allSpecSchedules = await prisma.special_Schedules.findMany({
        select: { id: true, restaurantId: true }
    });
    const specScheduleSet = new Set(allSpecSchedules.map(s => s.restaurantId));

    // Pre-fetch Payment Configs
    const allRestPayments = await prisma.restaurantPaymentConfig.findMany({
        select: { id: true, restaurantId: true, provider: true }
    });
    const restPaymentSet = new Set(allRestPayments.map(p => `${p.restaurantId}_${p.provider}`));

    // Pre-fetch Revenues
    const allRevenues = await prisma.restaurantRevenue.findMany({
        select: { id: true, restaurantId: true }
    });
    const revenueSet = new Set(allRevenues.map(r => r.restaurantId));

    const newPermEmpsToCreate = [];
    const newAreasToCreate = [];
    const newOpHoursToCreate = [];
    const newSpecSchedulesToCreate = [];
    const newPaymentsToCreate = [];
    const newRevenuesToCreate = [];

    for (const rData of restaurantsJson) {
        const brandId = brandMap.get(rData.brand_name);
        const managerUserId = userMap.get(rData.manager_user_name);

        if (!brandId) {
            console.warn(`⚠️ Bỏ qua Nhà hàng ${rData.name}: Không tìm thấy Brand ${rData.brand_name}`);
            continue;
        }

        // 1. Tạo hoặc Cập nhật Nhà hàng
        let restaurantId = restMap.get(rData.slug);
        if (!restaurantId) {
            const newRest = await prisma.restaurant.create({
                data: {
                    brandId: brandId,
                    name: rData.name,
                    slug: rData.slug,
                    logo: rData.logo,
                    imageMain: rData.imageMain,
                    images: rData.images,
                    city: rData.city,
                    address: rData.address,
                    email_contact: rData.email_contact,
                    phone_contact: rData.phone_contact,
                    description: rData.description,
                    statusByAdmin: rData.statusByAdmin,
                    statusByBrand: rData.statusByBrand,
                    isNew: rData.isNew,
                    weightedScore: rData.weightedScore,
                    ratingStats: rData.ratingStats,
                    bookingConfig: rData.bookingConfig,
                    taxConfig: rData.taxConfig,
                    inventoryConfig: rData.inventoryConfig,
                    templateId: defaultTemplateId,
                    categoryRestaurantIds: categoryIds,
                    restaurantAmenityIds: amenityIds,
                    tagIds: tagIds
                }
            });
            restaurantId = newRest.id;
            restMap.set(rData.slug, restaurantId);
        }

        // 2. Bảng Employment (Quản lý nhà hàng)
        if (managerUserId) {
            const empKey = `${managerUserId}_${restaurantId}`;
            let employmentId = employmentSet.get(empKey);
            if (!employmentId) {
                const newEmp = await prisma.employment.create({
                    data: {
                        userId: managerUserId,
                        restaurantId: restaurantId,
                        brandId: brandId,
                        workspaceRoleId: restRole.id,
                        salary_type: "MONTHLY"
                    }
                });
                employmentId = newEmp.id;
                employmentSet.set(empKey, employmentId);

                // Gom quyền cấp Restaurant
                for (const perm of restPermissions) {
                    newPermEmpsToCreate.push({
                        employmentId: employmentId,
                        permissionId: perm.id
                    });
                }
            }
        }

        // 3. Gom Khu vực (Areas)
        for (const area of rData.areas) {
            const areaKey = `${restaurantId}_${area.name}`;
            if (!areaSet.has(areaKey)) {
                newAreasToCreate.push({
                    restaurantId: restaurantId,
                    name: area.name,
                    description: area.description,
                    smoking_allowed: area.smoking_allowed,
                    is_outdoor: area.is_outdoor,
                    floor_number: area.floor_number,
                    is_active: area.is_active
                });
                areaSet.add(areaKey);
            }
        }

        // 4. Gom Giờ mở cửa (Operating Hours)
        for (const op of rData.operating_hours) {
            const opKey = `${restaurantId}_${op.day_of_week}`;
            if (!opHourSet.has(opKey)) {
                newOpHoursToCreate.push({
                    restaurantId: restaurantId,
                    day_of_week: op.day_of_week,
                    open_time: op.open_time,
                    close_time: op.close_time,
                    is_closed: op.is_closed,
                    break_start: op.break_start,
                    break_end: op.break_end
                });
                opHourSet.add(opKey);
            }
        }

        // 5. Gom Lịch đặc biệt (Special Schedules)
        if (!specScheduleSet.has(restaurantId)) {
            for (const spec of rData.special_schedules) {
                newSpecSchedulesToCreate.push({
                    restaurantId: restaurantId,
                    type: spec.schedule_type || "SPECIAL_HOURS",
                    reason: spec.reason,
                    open_time: spec.open_time,
                    close_time: spec.close_time,
                    date: new Date("2026-09-02T00:00:00.000Z")
                });
            }
            specScheduleSet.add(restaurantId);
        }

        // 6. Gom Cấu hình thanh toán tại chỗ (Payment Configs: CASH, MOMO, CARD)
        const providers = ["CASH", "MOMO", "CARD"];
        for (const prov of providers) {
            const payKey = `${restaurantId}_${prov}`;
            if (!restPaymentSet.has(payKey)) {
                newPaymentsToCreate.push({
                    restaurantId: restaurantId,
                    brandId: brandId,
                    provider: prov,
                    configData: {
                        enabled: true,
                        terminalId: `POS_${restaurantId.slice(-6).toUpperCase()}`
                    },
                    isActive: true,
                    isTestMode: false
                });
                restPaymentSet.add(payKey);
            }
        }

        // 7. Gom Doanh thu chi nhánh (Restaurant Revenues)
        if (rData.statusByAdmin === "ACTIVE" && !revenueSet.has(restaurantId)) {
            newRevenuesToCreate.push({
                restaurantId: restaurantId,
                brandId: brandId,
                amount: (Math.floor(Math.random() * 30) + 5) * 1000000, // 5tr - 35tr
                source: "DINE_IN",
                description: `Doanh thu phục vụ tại bàn của ${rData.name}`
            });
            revenueSet.add(restaurantId);
        }
    }

    // Batch Inserts song song (Bulk execution)
    await Promise.all([
        newPermEmpsToCreate.length > 0 ? prisma.permission_vs_Employment.createMany({ data: newPermEmpsToCreate }) : null,
        newAreasToCreate.length > 0 ? prisma.restaurant_Areas.createMany({ data: newAreasToCreate }) : null,
        newOpHoursToCreate.length > 0 ? prisma.operating_Hours.createMany({ data: newOpHoursToCreate }) : null,
        newSpecSchedulesToCreate.length > 0 ? prisma.special_Schedules.createMany({ data: newSpecSchedulesToCreate }) : null,
        newPaymentsToCreate.length > 0 ? prisma.restaurantPaymentConfig.createMany({ data: newPaymentsToCreate }) : null,
        newRevenuesToCreate.length > 0 ? prisma.restaurantRevenue.createMany({ data: newRevenuesToCreate }) : null
    ]);

    console.log(`✅ Đã khởi tạo và đồng bộ thành công ${restaurantsJson.length} Chi nhánh Nhà hàng & toàn bộ 7+ Tables liên quan!`);
    return true;
};
