import { prisma } from "../../../../databases/init.mongodb.js";
import { emitBrandSubscriptionUpdate } from "../../../../core/utils/socket.js";

class PayosWebhookService {
    async processIpn(payload) {
        // 1. Ghi log lại payload
        const systemMethod = await prisma.systemPaymentMethod.findUnique({ where: { code: 'PAYOS' } });
        if (!systemMethod) return;

        const webhookLog = await prisma.systemWebhookLog.create({
            data: {
                systemPaymentMethodId: systemMethod.id,
                event: payload.code || 'PAYOS_IPN',
                payload: payload,
                processed: false
            }
        });

        try {
            // Check success code from PayOS
            if (payload.code !== "00") {
                throw new Error("Giao dịch không thành công từ PayOS");
            }

            const { orderCode, amount } = payload.data;
            if (!orderCode) throw new Error("Thiếu orderCode");

            // Extract invoiceNumber from description (HD INV-...)
            const description = payload.data.description || "";
            const match = description.match(/HD (INV-\d+-\d+)/);
            if (!match) throw new Error("Không tìm thấy InvoiceNumber trong description");
            
            const invoiceNumber = match[1];

            // Tìm Invoice
            const invoice = await prisma.invoice.findUnique({
                where: { invoiceNumber },
                include: { subscription: { include: { plan: true } } }
            });

            if (!invoice) throw new Error("Không tìm thấy Hóa đơn");
            if (invoice.status === 'PAID') {
                // Idempotency: Hóa đơn đã PAID, bỏ qua
                await prisma.systemWebhookLog.update({
                    where: { id: webhookLog.id },
                    data: { processed: true, errorMsg: "Hóa đơn đã được thanh toán trước đó" }
                });
                return;
            }

            if (amount < invoice.total) {
                throw new Error("Số tiền thanh toán không đủ");
            }

            // Thực hiện Cập nhật
            await prisma.$transaction(async (tx) => {
                // 1. Cập nhật Invoice -> PAID
                await tx.invoice.update({
                    where: { id: invoice.id },
                    data: { 
                        status: 'PAID',
                        paidAt: new Date()
                    }
                });

                // 2. Cập nhật BrandSubscription hiện tại
                const now = new Date();
                let nextPeriodEnd = new Date(now);
                const billingCycle = invoice.subscription.plan?.billingCycle || 'MONTHLY';
                
                if (billingCycle === 'MONTHLY') {
                    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);
                } else if (billingCycle === 'YEARLY') {
                    nextPeriodEnd.setFullYear(nextPeriodEnd.getFullYear() + 1);
                } else if (billingCycle === 'LIFETIME') {
                    nextPeriodEnd.setFullYear(nextPeriodEnd.getFullYear() + 100);
                }

                // Hủy tất cả các gói đang ACTIVE cũ của brand này
                await tx.brandSubscription.updateMany({
                    where: {
                        brandId: invoice.brandId,
                        status: 'ACTIVE',
                        id: { not: invoice.brandSubscriptionId }
                    },
                    data: {
                        status: 'CANCELED',
                        cancellationReason: 'Nâng cấp/Đổi gói cước mới',
                        cancellationDate: now
                    }
                });

                await tx.brandSubscription.update({
                    where: { id: invoice.brandSubscriptionId },
                    data: {
                        status: 'ACTIVE',
                        currentPeriodStart: now,
                        currentPeriodEnd: nextPeriodEnd,
                        endDate: nextPeriodEnd
                    }
                });

                // 3. Tạo Transaction
                await tx.brandSubscriptionTransaction.create({
                    data: {
                        invoiceId: invoice.id,
                        amount: invoice.total,
                        userId: invoice.brandId, // Lưu ý: thực tế cần userId của người mua, nhưng webhook chỉ trả về data của invoice, nên lấy tạm brandId hoặc xử lý lấy admin user của brand
                        systemPaymentMethodId: systemMethod.id,
                        externalTransactionId: String(orderCode),
                        status: 'SUCCESS',
                        rawResponse: payload,
                        idempotencyKey: String(orderCode)
                    }
                });
            });

            // Ghi nhận thành công
            await prisma.systemWebhookLog.update({
                where: { id: webhookLog.id },
                data: { processed: true }
            });

        } catch (error) {
            // Ghi nhận thất bại
            await prisma.systemWebhookLog.update({
                where: { id: webhookLog.id },
                data: { processed: false, errorMsg: error.message }
            });
            console.error("Lỗi xử lý IPN PayOS:", error.message);
        }
    }
}

export const payosWebhookService = new PayosWebhookService();
