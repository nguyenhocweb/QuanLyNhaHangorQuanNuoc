import { deletePaymentMethodRepo } from "../repositories/payment_method.delete.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";

export const deletePaymentMethodService = async (id) => {
    const method = await prisma.systemPaymentMethod.findUnique({ where: { id } });
    if (!method) throw new NotFoundError("Phương thức thanh toán không tồn tại");

    // Check relations if needed (e.g. if it's used in transactions)
    // For now, let's just delete it
    return await deletePaymentMethodRepo(id);
};
