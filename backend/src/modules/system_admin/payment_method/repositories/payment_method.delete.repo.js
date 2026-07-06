import { prisma } from "../../../../databases/init.mongodb.js";

export const deletePaymentMethodRepo = async (id) => {
    return await prisma.systemPaymentMethod.delete({
        where: { id }
    });
};
