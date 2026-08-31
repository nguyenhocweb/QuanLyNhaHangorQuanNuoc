import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 02: Khởi tạo Toàn Diện 50 Thương Hiệu (Brands) & Toàn bộ 8+ Table Liên Quan
 * Tối ưu hóa hiệu năng bằng Batch In-Memory Map (High Performance Seeding < 3s)
 */
export const seedBrands = async () => {
    console.log("👉 [2/5] Khởi tạo 50 Thương hiệu & Toàn bộ Bảng quan hệ (Multi-Tenant Ecosystem)...");

    // 1. Tải dữ liệu Brand Managers & Brands từ JSON
    const brandsPath = new URL("../data/brands.json", import.meta.url);
    const brandsJson = JSON.parse(fs.readFileSync(brandsPath, "utf-8"));

    // 2. Pre-fetch toàn bộ Master Entities một lần duy nhất vào bộ nhớ (O(1) In-Memory Lookup)
    const brandRole = await prisma.workspaceRole.findUnique({
        where: { name: "Quản lý thương hiệu" }
    });

    if (!brandRole) {
        throw new Error("Lỗi: Không tìm thấy WorkspaceRole 'Quản lý thương hiệu'");
    }

    const [
        allUsers,
        allExistingBrands,
        brandPermissions,
        subscriptionPlans,
        templates,
        paymentMethods
    ] = await Promise.all([
        prisma.user.findMany({
            select: { id: true, user_name: true }
        }),
        prisma.brand.findMany({
            select: { id: true, name: true }
        }),
        prisma.permission.findMany({
            where: { type: "BRAND" }
        }),
        prisma.subscriptionPlan.findMany(),
        prisma.template.findMany({
            where: { type: "BRAND_TEMPLATE" }
        }),
        prisma.systemPaymentMethod.findMany()
    ]);

    const userMap = new Map(allUsers.map(u => [u.user_name, u.id]));
    const brandMap = new Map(allExistingBrands.map(b => [b.name, b.id]));
    const momoMethod = paymentMethods.find(m => m.code === "MOMO");
    const vnpayMethod = paymentMethods.find(m => m.code === "VNPAY");

    // Pre-fetch Employments hiện có
    const allEmployments = await prisma.employment.findMany({
        select: { id: true, userId: true, brandId: true }
    });
    const employmentSet = new Map(allEmployments.map(e => [`${e.userId}_${e.brandId}`, e.id]));

    // Pre-fetch Permission_vs_Employment
    const allPermEmps = await prisma.permission_vs_Employment.findMany({
        select: { employmentId: true, permissionId: true }
    });
    const permEmpSet = new Set(allPermEmps.map(pe => `${pe.employmentId}_${pe.permissionId}`));

    // Pre-fetch Subscriptions
    const allSubs = await prisma.brandSubscription.findMany({
        select: { id: true, brandId: true }
    });
    const subSet = new Set(allSubs.map(s => s.brandId));

    // Pre-fetch Payment Configs
    const allPaymentConfigs = await prisma.brandPaymentConfig.findMany({
        select: { id: true, brandId: true, systemPaymentMethodId: true }
    });
    const paymentConfigSet = new Set(allPaymentConfigs.map(pc => `${pc.brandId}_${pc.systemPaymentMethodId}`));

    // Pre-fetch AI Configs
    const allAiConfigs = await prisma.aIBrandConfig.findMany({
        select: { brandId: true }
    });
    const aiConfigSet = new Set(allAiConfigs.map(ai => ai.brandId));

    // Pre-fetch Notifications
    const allNotifs = await prisma.brandNotification.findMany({
        select: { id: true, brandId: true }
    });
    const notifSet = new Set(allNotifs.map(n => n.brandId));

    const newPermEmpsToCreate = [];

    for (const bData of brandsJson) {
        const managerUserId = userMap.get(bData.manager_user_name);
        if (!managerUserId) {
            continue;
        }

        const template = templates.find(t => t.code === bData.templateCode) || templates[0];

        // 1. Tạo hoặc Cập nhật Brand
        let brandId = brandMap.get(bData.brand_name);
        if (!brandId) {
            const newBrand = await prisma.brand.create({
                data: {
                    name: bData.brand_name,
                    logo: bData.logo,
                    email_contact: bData.email_contact,
                    phone_contact: bData.phone_contact,
                    description: bData.description,
                    tax_code: bData.tax_code,
                    link: bData.link,
                    imageMain: bData.imageMain,
                    images: bData.images,
                    isActive: bData.isActive,
                    address: bData.address,
                    isFeatured: bData.isFeatured,
                    new: bData.new,
                    taxConfig: bData.taxConfig,
                    inventoryConfig: bData.inventoryConfig,
                    templateId: template?.id || null
                }
            });
            brandId = newBrand.id;
            brandMap.set(bData.brand_name, brandId);
        }

        // 2. Bảng Employment (Liên kết User <-> Brand <-> Role)
        const empKey = `${managerUserId}_${brandId}`;
        let employmentId = employmentSet.get(empKey);
        if (!employmentId) {
            const newEmp = await prisma.employment.create({
                data: {
                    userId: managerUserId,
                    brandId: brandId,
                    workspaceRoleId: brandRole.id,
                    salary_type: "MONTHLY"
                }
            });
            employmentId = newEmp.id;
            employmentSet.set(empKey, employmentId);
        }

        // 3. Gom quyền cấp Brand để batch insert
        for (const perm of brandPermissions) {
            const permKey = `${employmentId}_${perm.id}`;
            if (!permEmpSet.has(permKey)) {
                newPermEmpsToCreate.push({
                    employmentId: employmentId,
                    permissionId: perm.id
                });
                permEmpSet.add(permKey);
            }
        }

        // 4. Bảng BrandSubscription
        if (!subSet.has(brandId)) {
            const targetPlan = subscriptionPlans.find(p => p.name === bData.subscription.planName) || subscriptionPlans[0];
            if (targetPlan) {
                const startDate = new Date();
                const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

                await prisma.brandSubscription.create({
                    data: {
                        brandId: brandId,
                        planId: targetPlan.id,
                        startDate: startDate,
                        endDate: endDate,
                        status: bData.subscription.status,
                        planName: targetPlan.name,
                        price: targetPlan.price,
                        maxRestaurants: targetPlan.maxRestaurants,
                        featuresData: targetPlan.featuresData,
                        autoRenew: bData.subscription.autoRenew,
                        currentPeriodStart: startDate,
                        currentPeriodEnd: endDate
                    }
                });
                subSet.add(brandId);
            }
        }

        // 5. Bảng BrandPaymentConfig (MoMo & VNPay)
        if (momoMethod) {
            const momoKey = `${brandId}_${momoMethod.id}`;
            if (!paymentConfigSet.has(momoKey)) {
                await prisma.brandPaymentConfig.create({
                    data: {
                        brandId: brandId,
                        systemPaymentMethodId: momoMethod.id,
                        configData: {
                            partnerCode: `MOMO_${bData.tax_code}`,
                            accessKey: `ACCESS_${brandId.slice(-8)}`,
                            secretKey: `SECRET_${brandId.slice(-12)}`
                        },
                        isActive: bData.paymentConfig.momoActive,
                        isTestMode: bData.paymentConfig.isTestMode
                    }
                });
                paymentConfigSet.add(momoKey);
            }
        }

        if (vnpayMethod) {
            const vnpayKey = `${brandId}_${vnpayMethod.id}`;
            if (!paymentConfigSet.has(vnpayKey)) {
                await prisma.brandPaymentConfig.create({
                    data: {
                        brandId: brandId,
                        systemPaymentMethodId: vnpayMethod.id,
                        configData: {
                            tmnCode: `VNP_${brandId.slice(-8).toUpperCase()}`,
                            hashSecret: `HASHSECRET_${brandId.slice(-16)}`
                        },
                        isActive: bData.paymentConfig.vnpayActive,
                        isTestMode: bData.paymentConfig.isTestMode
                    }
                });
                paymentConfigSet.add(vnpayKey);
            }
        }

        // 6. Bảng AIBrandConfig
        if (!aiConfigSet.has(brandId)) {
            await prisma.aIBrandConfig.create({
                data: {
                    brandId: brandId,
                    isActive: bData.aiConfig.isActive,
                    greetingMessage: bData.aiConfig.greetingMessage,
                    fallbackMessage: bData.aiConfig.fallbackMessage,
                    agentEscalation: bData.aiConfig.agentEscalation
                }
            });
            aiConfigSet.add(brandId);
        }

        // 7. Bảng BrandNotification & ReadReceipt
        if (!notifSet.has(brandId)) {
            const notif = await prisma.brandNotification.create({
                data: {
                    brandId: brandId,
                    title: `Chào mừng ${bData.brand_name} gia nhập hệ thống F&B Cloud!`,
                    body: `Thương hiệu của bạn đã được kích hoạt thành công với gói ${bData.subscription.planName}.`,
                    type: "SUBSCRIPTION"
                }
            });

            await prisma.brandNotificationReadReceipt.create({
                data: {
                    notificationId: notif.id,
                    userId: managerUserId,
                    isDeleted: false
                }
            });
            notifSet.add(brandId);
        }
    }

    // Batch insert permissions
    if (newPermEmpsToCreate.length > 0) {
        await prisma.permission_vs_Employment.createMany({
            data: newPermEmpsToCreate
        });
    }

    console.log(`✅ Đã khởi tạo và đồng bộ thành công ${brandsJson.length} Brands & toàn bộ 8+ Tables liên quan!`);
    return true;
};
