export class VietQRGateway {
    constructor(config) {
        // config = { bankId, accountNo, accountName }
        this.bankId = config.bankId;
        this.accountNo = config.accountNo;
        this.accountName = config.accountName;
    }

    /**
     * Tạo URL ảnh tĩnh VietQR
     */
    async createPaymentUrl(orderData) {
        const description = orderData.description || `PAY ${orderData.orderCode}`;
        const template = "compact2";
        
        const qrUrl = `https://img.vietqr.io/image/${this.bankId}-${this.accountNo}-${template}.png?amount=${orderData.amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(this.accountName)}`;

        return {
            qrCodeUrl: qrUrl,
            checkoutUrl: qrUrl, // Không có trang checkout, trả về thẳng ảnh
            transactionId: orderData.orderCode,
            rawResponse: null
        };
    }

    /**
     * Xác thực Webhook (Dành cho SePay / Casso nếu dùng)
     */
    verifyWebhook(webhookData) {
        // Logic xác thực webhook phụ thuộc vào SePay hoặc Casso API Token
        // Ở gateway tĩnh này ta bỏ qua hoặc viết logic tuỳ chọn
        return true;
    }
}
