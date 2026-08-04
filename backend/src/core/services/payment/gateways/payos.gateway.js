import { createPayOSInstance } from "../../../utils/payos.util.js";

export class PayOSGateway {
    constructor(config) {
        // config = { clientId, apiKey, checksumKey }
        this.config = config;
        this.payos = createPayOSInstance(config);
    }

    /**
     * Tạo liên kết thanh toán (Checkout URL / QR Code)
     */
    async createPaymentUrl(orderData) {
        // orderData: { orderCode, amount, description, returnUrl, cancelUrl }
        
        // Cấu trúc payload theo chuẩn của PayOS SDK
        const payload = {
            orderCode: Number(orderData.orderCode), // PayOS yêu cầu orderCode là số (tối đa 53 bit)
            amount: Math.round(orderData.amount),
            description: orderData.description?.substring(0, 25) || "Thanh toan don hang", // Max 25 chars
            returnUrl: orderData.returnUrl || "http://localhost:3000/success",
            cancelUrl: orderData.cancelUrl || "http://localhost:3000/cancel",
        };

        try {
            const paymentLinkRes = await this.payos.createPaymentLink(payload);
            
            return {
                qrCodeUrl: paymentLinkRes.qrCode,
                checkoutUrl: paymentLinkRes.checkoutUrl,
                transactionId: String(orderData.orderCode),
                rawResponse: paymentLinkRes
            };
        } catch (error) {
            throw new Error(`Tạo link PayOS thất bại: ${error.message}`);
        }
    }

    /**
     * Xác thực Webhook nhận từ PayOS
     */
    verifyWebhook(webhookData) {
        try {
            const verifiedData = this.payos.verifyPaymentWebhookData(webhookData);
            return verifiedData;
        } catch (error) {
            throw new Error("Chữ ký Webhook không hợp lệ");
        }
    }
}
