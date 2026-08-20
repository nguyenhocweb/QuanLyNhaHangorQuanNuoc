import { subscriptionPlansData } from '../constants/subscription.data.js';
import brandData from '../constants/brand.data.js';

export const Subscription_Extension = async (prisma) => {
    console.log('creating subscription plans and brand subscriptions...');

    // 1. Create Plans
    await prisma.subscriptionPlan.createMany({
        data: subscriptionPlansData
    });

    // 2. Map Brands to Plans
    const brandSubscriptions = brandData.map((brand, index) => {
        let planId = subscriptionPlansData[0].id; // Default to basic
        if (brand.isFeatured) {
            planId = subscriptionPlansData[1].id; // Pro
        }
        if (index % 5 === 0) {
            planId = subscriptionPlansData[2].id; // Enterprise for some
        }

        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // Valid for 1 year

        return {
            brandId: brand.id,
            planId: planId,
            startDate: new Date(),
            endDate: endDate,
            status: "ACTIVE"
        };
    });

    await prisma.brandSubscription.createMany({
        data: brandSubscriptions
    });

    // Lấy lại danh sách gói cước vừa tạo để lấy ID thật
    const subscriptions = await prisma.brandSubscription.findMany();

    // Tạo phương thức thanh toán giả lập
    const vnpay = await prisma.systemPaymentMethod.create({
        data: {
            name: "VNPay",
            code: "VNPAY",
            description: "Thanh toán qua ví VNPay"
        }
    });

    const firstUser = await prisma.user.findFirst();

    // Tạo Invoice cho từng BrandSubscription
    const invoices = subscriptions.map((sub, index) => {
        let price = 0;
        if (sub.planId === subscriptionPlansData[0].id) price = 0;
        else if (sub.planId === subscriptionPlansData[1].id) price = 499000;
        else price = 999000;

        return {
            brandSubscriptionId: sub.id,
            brandId: sub.brandId,
            invoiceNumber: `INV-SEED-${Math.floor(Math.random() * 1000000)}`,
            subTotal: price,
            total: price,
            status: "PAID",
            dueDate: new Date(),
            paidAt: new Date()
        };
    });

    await prisma.invoice.createMany({
        data: invoices
    });

    const createdInvoices = await prisma.invoice.findMany();

    // Tạo lịch sử giao dịch cho từng gói cước
    const transactions = createdInvoices.map((inv, index) => {
        return {
            invoiceId: inv.id,
            systemPaymentMethodId: vnpay.id,
            amount: inv.total,
            externalTransactionId: `VNPAY${Math.floor(Math.random() * 100000000)}`,
            userId: firstUser.id,
            status: "SUCCESS",
            rawResponse: { message: "Thanh toán thành công" }
        };
    });

    await prisma.brandSubscriptionTransaction.createMany({
        data: transactions
    });

    console.log(`✅ Đã tạo ${subscriptionPlansData.length} gói cước, gán cho ${brandSubscriptions.length} thương hiệu và tạo ${transactions.length} lịch sử thanh toán!`);
}
