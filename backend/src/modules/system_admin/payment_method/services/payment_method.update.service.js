import { updatePaymentMethodRepo } from "../repositories/payment_method.update.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";

export const updatePaymentMethodService = async (id, data) => {
    const method = await prisma.systemPaymentMethod.findUnique({ where: { id } });
    if (!method) throw new NotFoundError("Phương thức thanh toán không tồn tại");

    if (data.code && data.code !== method.code) {
        const existing = await prisma.systemPaymentMethod.findUnique({
            where: { code: data.code }
        });
        if (existing) throw new ConflictError("Mã code thanh toán đã tồn tại");
    }
    
    return await updatePaymentMethodRepo(id, data);
};
