import { PaymentFactory } from "./payment.factory.js";
import { prisma } from "../../../databases/init.mongodb.js";
import { BadRequestError } from "../../constants/error/index.js";

/**
 * Xử lý chung cho tất cả các loại Webhook Thanh toán (Momo, VNPay, PayOS)
 * @param {string} gatewayCode Mã cổng thanh toán (VD: PAYOS, MOMO)
 * @param {object} webhookData Body payload từ Webhook
 */
export const handlePaymentWebhook = async (gatewayCode, webhookData) => {
    // 1. Lấy thông tin cấu hình cổng tương ứng (Giả định lấy config gốc của Admin hệ thống hoặc của Brand/Restaurant)
    // Thực tế sẽ tuỳ thuộc vào nghiệp vụ, ví dụ: 
    // Nếu là PayOS thì lấy SecretKey của PayOS. Ở đây ta hardcode config môi trường cho Admin.
    const config = {
        clientId: process.env.PAYOS_CLIENT_ID,
        apiKey: process.env.PAYOS_API_KEY,
        checksumKey: process.env.PAYOS_CHECKSUM_KEY
    };

    // 2. Gọi Factory để lấy Gateway
    const gateway = PaymentFactory.getGateway(gatewayCode, config);

    // 3. Xác thực chữ ký
    try {
        gateway.verifyWebhook(webhookData);
    } catch (error) {
        throw new BadRequestError(`Xác thực Webhook thất bại: ${error.message}`);
    }

    // 4. Lấy mã giao dịch từ payload (Tuỳ theo cổng mà field sẽ khác nhau, ở PayOS là orderCode)
    const transactionId = webhookData.data.orderCode;

    // 5. Cập nhật trạng thái giao dịch
    // TODO: Viết logic query và update Transaction hoặc BrandSubscriptionTransaction
    // Việc cập nhật này có thể thực hiện thông qua một Service riêng.
    
    return {
        success: true,
        transactionId
    };
};
