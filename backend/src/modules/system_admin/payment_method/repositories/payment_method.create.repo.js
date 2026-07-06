import { prisma } from "../../../../databases/init.mongodb.js";

export const createPaymentMethodRepo = async (data) => {
    return await prisma.systemPaymentMethod.create({
        data
    });
};
