import { prisma } from "../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { PaymentFactory } from "../../../../core/services/payment/payment.factory.js";
import { emitBrandSubscriptionUpdate } from "../../../../core/utils/socket.js";

class CheckoutService {
  async createSession({ brandId, planId, userId }) {
    // 1. Kiểm tra plan
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) throw new NotFoundError("Gói cước không tồn tại hoặc đã bị ẩn");

    // Lấy giá trị thanh toán thực tế
    const amount = plan.discountPrice && plan.discountPrice > 0 ? plan.discountPrice : plan.price;
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (amount <= 0) {
      // Logic kích hoạt Gói Miễn Phí (Free/Trial) ngay lập tức
      const brandSubscription = await prisma.brandSubscription.create({
        data: {
          brandId,
          planId,
          status: 'ACTIVE', // Kích hoạt ngay
          startDate: new Date(),
          endDate: new Date(Date.now() + (plan.trialPeriodDays > 0 ? plan.trialPeriodDays : 30) * 24 * 60 * 60 * 1000), // Mặc định 30 ngày nếu ko có trial
          planName: plan.name,
          price: plan.price,
          maxRestaurants: plan.maxRestaurants,
          featuresData: plan.featuresData,
        }
      });

      const invoice = await prisma.invoice.create({
        data: {
          brandSubscriptionId: brandSubscription.id,
          brandId,
          invoiceNumber,
          subTotal: 0,
          discountAmount: 0,
          taxAmount: 0,
          total: 0,
          currency: 'VND',
          status: 'PAID', // Đã thanh toán
          paidAt: new Date(),
          dueDate: new Date(),
        }
      });

      // Emit realtime cập nhật
      emitBrandSubscriptionUpdate(brandId);

      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        brandSubscriptionId: brandSubscription.id,
        checkoutUrl: null // Không cần link thanh toán
      };
    }

    // 2. Tìm cấu hình thanh toán của Platform (PAYOS)
    const adminConfig = await prisma.adminPaymentConfig.findFirst({
      where: {
        isActive: true,
        systemPaymentMethod: {
          code: 'PAYOS',
          isActive: true
        }
      },
      include: {
        systemPaymentMethod: true
      }
    });

    if (!adminConfig || !adminConfig.configData) {
      throw new BadRequestError("Hệ thống chưa cấu hình cổng thanh toán VietQR (PayOS)");
    }

    const payosConfig = adminConfig.configData;

    // 3. Tạo BrandSubscription (Trạng thái PENDING_PAYMENT)
    const brandSubscription = await prisma.brandSubscription.create({
      data: {
        brandId,
        planId,
        status: 'PENDING_PAYMENT',
        startDate: new Date(),
        endDate: new Date(), // Sẽ cập nhật lại khi thanh toán thành công
        planName: plan.name,
        price: plan.price,
        maxRestaurants: plan.maxRestaurants,
        featuresData: plan.featuresData,
      }
    });

    // 4. Tạo Invoice
    let invoice = await prisma.invoice.create({
      data: {
        brandSubscriptionId: brandSubscription.id,
        brandId,
        invoiceNumber,
        subTotal: plan.price,
        discountAmount: plan.discountPrice ? plan.price - plan.discountPrice : 0,
        taxAmount: 0,
        total: amount,
        currency: 'VND',
        status: 'OPEN',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Hạn 3 ngày
      }
    });

    const orderCodeNum = Number(String(Date.now()).slice(-9) + Math.floor(Math.random() * 100));
    
    // 5. Khởi tạo Gateway và gọi PayOS tạo link
    const gateway = PaymentFactory.getGateway('PAYOS', payosConfig);
    const result = await gateway.createPaymentUrl({
      orderCode: orderCodeNum,
      amount,
      description: `HD ${invoiceNumber}`.substring(0, 25),
      returnUrl: `${process.env.FRONTEND_URL}/brand_owner/billing?status=success`,
      cancelUrl: `${process.env.FRONTEND_URL}/brand_owner/billing?status=cancel`,
    });

    // 6. Cập nhật lại paymentUrl vào Invoice
    invoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paymentUrl: result.checkoutUrl }
    });

    // Trả về dữ liệu
    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      brandSubscriptionId: brandSubscription.id,
      ...result
    };
  }
}

export const checkoutService = new CheckoutService();
