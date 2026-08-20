import { handlePaymentWebhook } from "../../../../../core/services/payment/webhook.handler.js";
import * as adminWebhookRepo from "../repositories/admin.webhook.repo.js";
// Giả định socket.js export { getIO }
// import { getIO } from "../../../../../core/utils/socket.js";

export const processAdminWebhook = async (gatewayCode, webhookData) => {
    // 1. Xác thực chữ ký bằng handler dùng chung (PaymentFactory)
    const result = await handlePaymentWebhook(gatewayCode, webhookData);
    
    if (!result.success) {
        throw new Error("Xác thực Webhook thất bại");
    }

    const transactionId = result.transactionId; // Đây là externalTransactionId / orderCode

    // 1.5. Kiểm tra giao dịch Test (Kiểm định thanh toán 1.000đ)
    const { prisma } = await import("../../../../../databases/init.mongodb.js");
    const testConfig = await prisma.adminPaymentConfig.findFirst({
        where: { lastTestOrderCode: transactionId.toString() }
    });

    if (testConfig) {
        // Đã nhận được 1.000đ cho lệnh test này
        await prisma.adminPaymentConfig.update({
            where: { id: testConfig.id },
            data: { 
                verificationStatus: 'VERIFIED',
                lastVerifiedAt: new Date(),
                lastTestOrderCode: null
            }
        });

        // Bắn WebSocket về Client (Nếu có cấu hình)
        try {
            const { getIO } = await import("../../../../../core/utils/socket.js");
            const io = getIO();
            if (io) {
                // Gửi event tới một room cụ thể hoặc emit toàn cầu (ở đây dùng id của systemPaymentMethod)
                io.emit("payment_verification_success", { 
                    systemPaymentMethodId: testConfig.systemPaymentMethodId 
                });
            }
        } catch (error) {
            console.log("WebSocket emit error:", error.message);
        }

        return { message: "Xác thực cấu hình thanh toán thành công", isTest: true };
    }

    // 2. Tìm kiếm Giao dịch gói cước
    const transaction = await adminWebhookRepo.findTransactionByExternalId(transactionId);

    if (!transaction) {
        throw new Error("Không tìm thấy giao dịch với mã này");
    }

    // 3. Check Idempotency
    if (transaction.status === 'SUCCESS') {
        return { message: "Giao dịch đã được xử lý trước đó", alreadyProcessed: true };
    }

    if (transaction.status === 'PENDING') {
        // 4. Cập nhật Transaction
        await adminWebhookRepo.updateTransactionStatus(transaction.id, 'SUCCESS');

        // 5. Cập nhật Subscription
        const updatedSub = await adminWebhookRepo.activateSubscription(transaction.brandSubscriptionId);

        // 6. Phát sự kiện (tuỳ chọn)
        // const io = getIO();
        // io.to(updatedSub.brandId).emit("subscription_payment_success", {
        //     message: "Thanh toán gói cước thành công",
        //     transactionId: transaction.id,
        //     subscriptionId: updatedSub.id
        // });

        return { message: "Xử lý thành công", brandId: updatedSub.brandId };
    }

    return { message: "Trạng thái giao dịch không hợp lệ" };
};
