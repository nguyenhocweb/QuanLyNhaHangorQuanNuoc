import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 09: Khởi tạo Kiểm Toán Hệ Thống (System Audit), AI Chatbox & ApiKeys,
 * Yêu Cầu Nâng Cấp (UpgradeRequests), Webhook Logs, Doanh Thu Hệ Thống & Thông Báo Toàn Sàn
 * Tải trực tiếp từ data/system_audit.json
 */
export const seedSystemAudit = async () => {
    console.log("👉 [9/9] Khởi tạo AI ApiKeys, Webhook Logs & Doanh thu sàn (từ data/system_audit.json)...");

    // 1. Đọc dữ liệu từ data/system_audit.json
    const auditPath = new URL("../data/system_audit.json", import.meta.url);
    const auditData = JSON.parse(fs.readFileSync(auditPath, "utf-8"));

    // 2. Tải Super Admin, Customers, Payment Methods
    const [adminUser, customers, sysPaymentMethods] = await Promise.all([
        prisma.user.findFirst({
            where: { systemRole: { name: "Admin" } }
        }),
        prisma.user.findMany({
            where: { systemRole: { name: "Khách hàng" } },
            take: 5
        }),
        prisma.systemPaymentMethod.findMany()
    ]);

    // 3. Khởi tạo AiChatbox & AiModel từ JSON
    for (const p of auditData.ai_platforms) {
        const chatbox = await prisma.aiChatbox.upsert({
            where: { name: p.platform_name },
            update: { isActive: true },
            create: { name: p.platform_name, isActive: true }
        });

        let primaryModelId = null;
        for (const m of p.models) {
            const aiModel = await prisma.aiModel.findFirst({
                where: { name: m.name, chatboxId: chatbox.id }
            }) || await prisma.aiModel.create({
                data: {
                    chatboxId: chatbox.id,
                    name: m.name,
                    displayName: m.displayName
                }
            });
            if (!primaryModelId) primaryModelId = aiModel.id;
        }

        if (p.default_api_key) {
            const existingKey = await prisma.apiKey.findFirst({ where: { keyHash: p.default_api_key.keyHash } });
            if (!existingKey) {
                await prisma.apiKey.create({
                    data: {
                        name: p.default_api_key.name,
                        encryptedKey: p.default_api_key.encryptedKey,
                        keyHash: p.default_api_key.keyHash,
                        prefix: p.default_api_key.prefix,
                        keyType: p.default_api_key.keyType,
                        status: p.default_api_key.status,
                        contactEmail: adminUser?.email || "admin@nhahang.com",
                        chatboxId: chatbox.id,
                        restrictedModelId: primaryModelId,
                        lastUsedAt: new Date()
                    }
                });
            }
        }
    }

    // 4. Khởi tạo UpgradeRequest (Khách hàng xin nâng cấp lên Quản lý thương hiệu)
    if (customers.length > 0) {
        for (let i = 0; i < Math.min(customers.length, 3); i++) {
            const cust = customers[i];
            await prisma.upgradeRequest.upsert({
                where: { userId: cust.id },
                update: {
                    brandName: `Thương Hiệu Trà & Bánh Ngọt Của ${cust.name}`,
                    status: i === 0 ? "PENDING" : i === 1 ? "APPROVED" : "REJECTED"
                },
                create: {
                    userId: cust.id,
                    brandName: `Thương Hiệu Trà & Bánh Ngọt Của ${cust.name}`,
                    tax_code: `03099988${i}`,
                    businessLicense: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
                    status: i === 0 ? "PENDING" : i === 1 ? "APPROVED" : "REJECTED"
                }
            });
        }
    }

    // 5. Khởi tạo Webhook Logs (SystemWebhookLog)
    if (sysPaymentMethods.length > 0) {
        const vnpayMethod = sysPaymentMethods.find(m => m.code === "VNPAY") || sysPaymentMethods[0];
        await prisma.systemWebhookLog.create({
            data: {
                systemPaymentMethodId: vnpayMethod.id,
                event: "vnpay.ipn.payment_success",
                payload: {
                    vnp_TxnRef: "SUB_TXN_20260830_9988",
                    vnp_Amount: "299000000",
                    vnp_ResponseCode: "00",
                    vnp_TransactionNo: "14567890",
                    vnp_BankCode: "NCB",
                    vnp_PayDate: "20260830130000"
                },
                processed: true
            }
        });
    }

    // 6. Khởi tạo Doanh thu toàn sàn của Super Admin từ JSON
    const existingSysRevenues = await prisma.systemRevenue.findMany({ take: 3 });
    if (existingSysRevenues.length === 0) {
        await prisma.systemRevenue.createMany({
            data: auditData.system_revenues
        });
    }

    // 7. Khởi tạo Thông báo toàn sàn từ JSON
    for (const notif of auditData.system_notifications) {
        const existingSysNotif = await prisma.systemNotification.findFirst({
            where: { title: notif.title }
        });
        if (!existingSysNotif) {
            await prisma.systemNotification.create({
                data: {
                    title: notif.title,
                    body: notif.body,
                    type: notif.type
                }
            });
        }
    }

    console.log("✅ Đã khởi tạo hoàn tất Kiểm toán Hệ thống từ data/system_audit.json!");
    return true;
};
