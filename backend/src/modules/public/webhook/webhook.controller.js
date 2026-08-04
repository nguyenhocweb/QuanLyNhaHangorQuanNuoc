import { handlePaymentWebhook } from "../../../core/services/payment/webhook.handler.js";
import { prisma } from "../../../databases/init.mongodb.js";

/**
 * Endpoint nhận webhook từ đối tác thanh toán
 */
export const paymentWebhookController = async (req, res) => {
    try {
        const { gatewayCode } = req.params;
        const webhookData = req.body;

        // 1. Uỷ quyền cho Webhook Handler dùng chung xác thực chữ ký
        const result = await handlePaymentWebhook(gatewayCode, webhookData);

        if (result.success) {
            // 2. Tìm Transaction tương ứng với externalTransactionId (orderCode)
            const transactionId = result.transactionId;
            
            // Ở đây PayOS/Momo trả về orderCode mà chúng ta đã gửi lúc tạo URL
            // (Lưu trong externalTransactionId)
            const transaction = await prisma.brandSubscriptionTransaction.findFirst({
                where: { externalTransactionId: String(transactionId) }
            });

            if (transaction && transaction.status === 'PENDING') {
                // 3. Cập nhật trạng thái thành công
                await prisma.brandSubscriptionTransaction.update({
                    where: { id: transaction.id },
                    data: { status: 'SUCCESS' }
                });

                // Kích hoạt Subscription
                const updatedSub = await prisma.brandSubscription.update({
                    where: { id: transaction.brandSubscriptionId },
                    data: { status: 'ACTIVE' }
                });

                // Phát sự kiện realtime tới Brand Owner (qua Socket.IO)
                const { getIO } = await import("../../../core/utils/socket.js");
                getIO().to(updatedSub.brandId).emit("subscription_payment_success", {
                    message: "Thanh toán thành công",
                    transactionId: transaction.id,
                    subscriptionId: updatedSub.id
                });
            }

            // Trả về cho Đối tác (PayOS/Momo) để họ biết webhook đã được xử lý thành công
            return res.status(200).json({
                success: true,
                message: "Webhook processed successfully"
            });
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        // Trả về 200 kèm error message để các đối tác không gửi lại webhook liên tục gây spam
        // (Tuỳ đối tác mà cần trả 400 hay 200, PayOS recommend trả 200 với mã lỗi)
        return res.status(200).json({
            success: false,
            message: error.message
        });
    }
};
