import { prisma } from "../../../../databases/init.mongodb.js";

export const getPaymentMethodsRepo = async () => {
    return await prisma.systemPaymentMethod.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const getPaymentMethodByIdRepo = async (id) => {
    return await prisma.systemPaymentMethod.findUnique({
        where: { id }
    });
};
