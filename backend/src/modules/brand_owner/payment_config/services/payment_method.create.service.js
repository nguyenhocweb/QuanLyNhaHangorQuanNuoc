import { ConflictError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { createBrandPaymentMethodRepo } from "../repositories/payment_config.get.repo.js";

export const createBrandPaymentMethodService = async (payload) => {
    const existing = await prisma.systemPaymentMethod.findUnique({
        where: { code: payload.code.trim().toUpperCase() }
    });
    if (existing) {
        throw new ConflictError(`Mã phương thức "${payload.code}" đã tồn tại trên hệ thống`);
    }

    const created = await createBrandPaymentMethodRepo(payload);
    return {
        message: "Tạo phương thức thanh toán thành công",
        metadata: created
    };
};
