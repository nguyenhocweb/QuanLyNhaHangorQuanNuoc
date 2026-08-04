import { getSubscriptionPlanById, createBrandSubscriptionAndTransaction } from "../repositories/brand_subscription.create.repo.js";
import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { PaymentFactory } from "../../../../core/services/payment/payment.factory.js";

export const createPaymentService = async (userId, planId, systemPaymentMethodId) => {
    // 1. Kiểm tra xem user có thuộc brand nào không
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new ForbiddenError("Người dùng không thuộc thương hiệu nào");
    }
    const brandId = employment.brandId;

    // 2. Kiểm tra gói cước
    const plan = await getSubscriptionPlanById(planId);
    if (!plan) {
        throw new NotFoundError("Gói cước không tồn tại");
    }

    // Tính toán ngày kết thúc dựa trên billingCycle
    const endDate = new Date();
    if (plan.billingCycle === 'MONTHLY') {
        endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billingCycle === 'YEARLY') {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (plan.billingCycle === 'LIFETIME') {
        endDate.setFullYear(endDate.getFullYear() + 100);
    }

    // 3. Xử lý Payment Method (mặc định lấy phương thức đầu tiên nếu không truyền)
    let paymentMethodId = systemPaymentMethodId;
    let paymentMethod = null;
    
    if (!paymentMethodId) {
        paymentMethod = await prisma.systemPaymentMethod.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
        if (!paymentMethod) {
            throw new BadRequestError("Hệ thống chưa cấu hình phương thức thanh toán");
        }
        paymentMethodId = paymentMethod.id;
    } else {
        paymentMethod = await prisma.systemPaymentMethod.findUnique({
            where: { id: paymentMethodId }
        });
        if (!paymentMethod) {
             throw new BadRequestError("Phương thức thanh toán không tồn tại");
        }
    }

    // 4. Tạo Subscription và Transaction
    const { subscription, transaction } = await createBrandSubscriptionAndTransaction({
        brandId,
        planId,
        amount: plan.price,
        userId,
        systemPaymentMethodId: paymentMethodId,
        endDate
    });

    // 5. Tích hợp Factory Pattern để gọi đúng cổng thanh toán
    // Giả sử mã cổng (code) của SystemPaymentMethod là "VIETQR", "PAYOS", "MOMO", v.v.
    // Nếu chưa có, mặc định dùng VIETQR tĩnh
    const gatewayCode = paymentMethod.code || 'VIETQR';
    
    // Cấu hình tuỳ theo gatewayCode (Thực tế nên lưu trong biến môi trường hoặc db config)
    const config = {
        // Cấu hình VietQR Tĩnh
        bankId: process.env.VIETQR_BANK_ID || "970436", 
        accountNo: process.env.VIETQR_ACCOUNT_NO || "1111111111",
        accountName: process.env.VIETQR_ACCOUNT_NAME || "NGUYEN VAN A",
        
        // Cấu hình PayOS (Nếu gatewayCode = PAYOS)
        clientId: process.env.PAYOS_CLIENT_ID,
        apiKey: process.env.PAYOS_API_KEY,
        checksumKey: process.env.PAYOS_CHECKSUM_KEY
    };

    // Description dùng transaction ID để khi webhook gọi về, ta biết đang thanh toán cho giao dịch nào
    const orderCode = transaction.id.substring(transaction.id.length - 8).toUpperCase();
    const description = `PAY ${orderCode}`;
    
    // Khởi tạo Gateway thông qua Factory
    const gateway = PaymentFactory.getGateway(gatewayCode, config);
    
    // Lấy URL thanh toán
    let paymentResult = null;
    try {
        paymentResult = await gateway.createPaymentUrl({
            orderCode,
            amount: plan.price,
            description,
            returnUrl: "http://localhost:3000/brand-owner/brand/subscription", // VD: url trang frontend
            cancelUrl: "http://localhost:3000/brand-owner/brand/subscription"
        });
    } catch (error) {
         // Nếu PayOS lỗi (chưa config API key, v.v.), fallback về VIETQR tĩnh
         const fallbackGateway = PaymentFactory.getGateway('VIETQR', config);
         paymentResult = await fallbackGateway.createPaymentUrl({
            orderCode,
            amount: plan.price,
            description,
         });
    }

    // Cập nhật lại externalTransactionId với orderCode để dễ tra cứu
    await prisma.brandSubscriptionTransaction.update({
        where: { id: transaction.id },
        data: { externalTransactionId: orderCode, rawResponse: paymentResult.rawResponse }
    });

    return {
        transactionId: transaction.id,
        subscriptionId: subscription.id,
        amount: plan.price,
        description: description,
        qrCodeUrl: paymentResult.qrCodeUrl,
        checkoutUrl: paymentResult.checkoutUrl
    };
};
