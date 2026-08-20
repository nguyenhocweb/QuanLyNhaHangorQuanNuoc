import { prisma } from "../../../../databases/init.mongodb.js";
import { PaymentFactory } from "../../../../core/services/payment/payment.factory.js";
import { NotFoundError, BadRequestError } from "../../../../core/constants/error/index.js";

export const verifyAdminPaymentConfigService = async (systemPaymentMethodId) => {
    const config = await prisma.adminPaymentConfig.findUnique({
        where: { systemPaymentMethodId },
        include: { systemPaymentMethod: true }
    });

    if (!config) {
        throw new NotFoundError("Không tìm thấy cấu hình thanh toán");
    }

    const providerCode = config.systemPaymentMethod.code;

    // Các phương thức thủ công (CASH, BANK_TRANSFER) tự động pass kiểm định
    if (providerCode === "CASH" || providerCode === "BANK_TRANSFER") {
        const updated = await prisma.adminPaymentConfig.update({
            where: { id: config.id },
            data: {
                verificationStatus: "VERIFIED",
                lastVerifiedAt: new Date()
            }
        });
        return {
            status: "VERIFIED",
            message: "Phương thức thủ công tự động được phê duyệt."
        };
    }

    // Các phương thức online (PAYOS, VNPAY, MOMO...) cần tạo QR 1.000đ
    try {
        const gateway = PaymentFactory.getGateway(providerCode, config.configData);
        
        // Tạo mã đơn hàng độc nhất để track
        const testOrderCode = Math.floor(Date.now() / 1000); // PayOS requires integer (max 53 bit)
        
        // Cập nhật lastTestOrderCode vào config
        await prisma.adminPaymentConfig.update({
            where: { id: config.id },
            data: { lastTestOrderCode: testOrderCode.toString() }
        });

        // Tạo đơn hàng thanh toán 1,000 VND
        const paymentData = {
            orderCode: testOrderCode,
            amount: 1000, // 1000 VND
            description: `Verify ${providerCode}`,
            returnUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
            cancelUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        };

        const paymentLink = await gateway.createPaymentUrl(paymentData);

        return {
            status: "UNVERIFIED",
            testOrderCode: testOrderCode.toString(),
            checkoutUrl: paymentLink.checkoutUrl,
            qrCodeUrl: paymentLink.qrCodeUrl || paymentLink.qrCode // Tùy thuộc gateway trả về gì
        };

    } catch (error) {
        throw new BadRequestError(`Lỗi khi gọi cổng thanh toán: ${error.message}`);
    }
};
