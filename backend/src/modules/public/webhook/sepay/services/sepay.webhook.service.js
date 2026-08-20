import crypto from "crypto";
import { ForbiddenError, BadRequestError } from "../../../../../core/constants/error/index.js";
import * as sepayRepo from "../repositories/sepay.webhook.repo.js";

// Giả định chúng ta có một module Socket.io để emit sự kiện (được pass từ app hoặc gọi thông qua 1 file utility)
// Ví dụ: import { getIo } from "../../../../../core/socket/socket.js";

export const handleSepayWebhookLogic = async (token, webhookData) => {
    // 1. Hash token nhận được
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Tra cứu config
    const config = await sepayRepo.findConfigByTokenHash(tokenHash);
    if (!config) {
        throw new ForbiddenError("Invalid Webhook Token");
    }

    const { amountIn, transactionContent, referenceNumber } = webhookData;
    if (!amountIn || amountIn <= 0) {
        // Chỉ xử lý tiền vào
        return { message: "Ignored amount <= 0" };
    }

    // 3. Idempotency Check
    const systemPaymentMethodId = config.systemPaymentMethodId;
    const existingTransaction = await sepayRepo.checkTransactionExists(referenceNumber, systemPaymentMethodId);
    if (existingTransaction) {
        // Đã xử lý rồi, bỏ qua
        return { message: "Duplicate transaction" };
    }

    // 4. Bóc tách nội dung
    const regex = /PAY O([A-Za-z0-9]+)/i;
    const match = transactionContent ? transactionContent.match(regex) : null;
    let order = null;

    if (match && match[1]) {
        const orderNumber = match[1];
        order = await sepayRepo.findOrderByOrderNumber(orderNumber);
    }

    // 5. Tạo dữ liệu Transaction (Dù tìm thấy Order hay không vẫn phải lưu)
    let transactionStatus = "SUCCESS";
    
    const transactionRecord = await sepayRepo.createTransaction({
        orderId: order ? order.id : null,
        amount: amountIn,
        systemPaymentMethodId,
        externalTransactionId: referenceNumber,
        status: transactionStatus,
        rawResponse: webhookData
    });

    // 6. Xử lý logic gạch nợ nếu tìm thấy đơn hàng
    if (order && order.status !== "PAID") {
        let newStatus = order.status;
        if (amountIn >= order.total_amount) {
            newStatus = "PAID";
        } else {
            newStatus = "PARTIALLY_PAID";
        }

        await sepayRepo.updateOrderStatus(order.id, newStatus, new Date(), systemPaymentMethodId);

        // 7. Emit Realtime event về FE (Tích hợp sau)
        // const io = getIo();
        // io.to(`order_${order.id}`).emit("payment_update", { status: newStatus, amountIn });
    }

    return { message: "Webhook processed successfully", orderId: order?.id };
};
