import { createPaymentMethodRepo } from "../repositories/payment_method.create.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { ConflictError } from "../../../../core/constants/error/index.js";

export const createPaymentMethodService = async (data) => {
    const existing = await prisma.systemPaymentMethod.findUnique({
        where: { code: data.code }
    });
    if (existing) throw new ConflictError("Mã code thanh toán đã tồn tại");
    
    return await createPaymentMethodRepo(data);
};
