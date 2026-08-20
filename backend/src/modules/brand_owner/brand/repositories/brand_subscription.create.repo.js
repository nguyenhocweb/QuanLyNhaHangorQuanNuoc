import { prisma } from "../../../../databases/init.mongodb.js";

export const getSubscriptionPlanById = async (planId) => {
    return await prisma.subscriptionPlan.findUnique({
        where: { id: planId }
    });
};

export const createBrandSubscriptionAndTransaction = async (data) => {
    const { brandId, planId, amount, userId, systemPaymentMethodId, endDate, plan } = data;
    
    // Tạo Subscription và Transaction trong cùng 1 Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
        const subscription = await tx.brandSubscription.create({
            data: {
                brandId,
                planId,
                endDate,
                status: 'PENDING_PAYMENT',
                planName: plan?.name,
                price: plan?.price,
                maxRestaurants: plan?.maxRestaurants,
                featuresData: plan?.featuresData,
            }
        });

        const transaction = await tx.brandSubscriptionTransaction.create({
            data: {
                brandSubscriptionId: subscription.id,
                amount,
                userId,
                systemPaymentMethodId, // Có thể truyền giá trị mặc định của VietQR nếu có, hoặc để null (tuỳ schema, hiện schema bắt buộc)
                status: 'PENDING'
            }
        });

        return { subscription, transaction };
    });

    return result;
};
