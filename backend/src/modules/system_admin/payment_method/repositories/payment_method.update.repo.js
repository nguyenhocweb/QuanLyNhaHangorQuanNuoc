import { prisma } from "../../../../databases/init.mongodb.js";

export const updatePaymentMethodRepo = async (id, data) => {
    return await prisma.systemPaymentMethod.update({
        where: { id },
        data
    });
};
