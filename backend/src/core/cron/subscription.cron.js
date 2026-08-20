import cron from "node-cron";
import { prisma } from "../../databases/init.mongodb.js";

// Chạy vào 00:00 mỗi ngày
cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Bắt đầu quét gia hạn gói cước Brand...");
    try {
        const now = new Date();
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Tìm các gói cước autoRenew sắp hết hạn (trong vòng 3 ngày tới) và chưa có hóa đơn DRAFT/OPEN nào
        const expiringSubscriptions = await prisma.brandSubscription.findMany({
            where: {
                autoRenew: true,
                status: 'ACTIVE',
                endDate: {
                    lte: threeDaysLater,
                    gte: now
                },
                invoices: {
                    none: {
                        status: {
                            in: ['DRAFT', 'OPEN']
                        }
                    }
                }
            },
            include: {
                plan: true
            }
        });

        console.log(`[CRON] Tìm thấy ${expiringSubscriptions.length} gói cước sắp hết hạn cần gia hạn.`);

        for (const sub of expiringSubscriptions) {
            // Tạo Invoice OPEN
            const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const amount = sub.plan.discountPrice && sub.plan.discountPrice > 0 ? sub.plan.discountPrice : sub.plan.price;

            await prisma.invoice.create({
                data: {
                    brandSubscriptionId: sub.id,
                    brandId: sub.brandId,
                    invoiceNumber,
                    subTotal: sub.plan.price,
                    discountAmount: sub.plan.discountPrice ? sub.plan.price - sub.plan.discountPrice : 0,
                    taxAmount: 0,
                    total: amount,
                    currency: 'VND',
                    status: 'OPEN',
                    dueDate: new Date(sub.endDate.getTime() + 3 * 24 * 60 * 60 * 1000), // Cho thêm 3 ngày ân hạn
                }
            });

            console.log(`[CRON] Đã tạo hóa đơn gia hạn ${invoiceNumber} cho Brand ${sub.brandId}`);
            
            // TODO: Bắn Event/Email thông báo cho Brand Owner (Tích hợp Sendgrid sau)
        }

        console.log("[CRON] Quét gia hạn hoàn tất.");
    } catch (error) {
        console.error("[CRON] Lỗi khi chạy cron gia hạn:", error);
    }
});
