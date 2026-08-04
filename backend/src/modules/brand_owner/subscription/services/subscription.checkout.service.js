import { prisma } from "../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { PaymentFactory } from "../../../../core/services/payment/payment.factory.js";

class CheckoutService {
  async createSession({ brandId, planId, userId }) {
    // 1. Kiểm tra plan
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) throw new NotFoundError("Gói cước không tồn tại hoặc đã bị ẩn");

    // Lấy giá trị thanh toán thực tế
    const amount = plan.discountPrice && plan.discountPrice > 0 ? plan.discountPrice : plan.price;
    if (amount <= 0) throw new BadRequestError("Gói cước miễn phí không cần thanh toán");

    // 2. Tìm cấu hình thanh toán của Platform (PAYOS)
    const systemMethod = await prisma.systemPaymentMethod.findUnique({ where: { code: 'PAYOS' } });
    if (!systemMethod || !systemMethod.isActive || !systemMethod.systemConfig) {
      throw new BadRequestError("Hệ thống chưa cấu hình cổng thanh toán VietQR (PayOS)");
    }

    const payosConfig = systemMethod.systemConfig;

    // 3. Tạo BrandSubscription (Trạng thái PENDING_PAYMENT)
    // Tính toán ngày hết hạn (tạm thời để null hoặc cộng theo chu kỳ, sau khi thanh toán thành công sẽ cộng dồn chuẩn xác)
    const brandSubscription = await prisma.brandSubscription.create({
      data: {
        brandId,
        planId,
        status: 'PENDING_PAYMENT',
        startDate: new Date(),
        endDate: new Date(), // Chưa cần chính xác lúc này
      }
    });

    // 4. Tạo BrandSubscriptionTransaction
    const orderCodeNum = Number(String(Date.now()).slice(-9) + Math.floor(Math.random() * 1000)); // Đảm bảo là 1 số dương an toàn (<= 53bit)
    
    const transaction = await prisma.brandSubscriptionTransaction.create({
      data: {
        brandSubscriptionId: brandSubscription.id,
        amount,
        userId,
        systemPaymentMethodId: systemMethod.id,
        externalTransactionId: String(orderCodeNum),
        status: 'PENDING'
      }
    });

    // 5. Khởi tạo Gateway và gọi PayOS tạo link
    const gateway = PaymentFactory.getGateway('PAYOS', payosConfig);
    const result = await gateway.createPaymentUrl({
      orderCode: orderCodeNum,
      amount,
      description: `Mua goi ${plan.name}`.substring(0, 25),
      returnUrl: `${process.env.FRONTEND_URL}/dashboard/brand/subscription?status=success`,
      cancelUrl: `${process.env.FRONTEND_URL}/dashboard/brand/subscription?status=cancel`,
    });

    // Trả về QR Code và Checkout URL
    return {
      transactionId: transaction.id,
      brandSubscriptionId: brandSubscription.id,
      ...result
    };
  }
}

export const checkoutService = new CheckoutService();
