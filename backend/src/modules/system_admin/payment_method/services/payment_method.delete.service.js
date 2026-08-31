import { deletePaymentMethodRepo } from "../repositories/payment_method.delete.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";

export const deletePaymentMethodService = async (id) => {
    const method = await prisma.systemPaymentMethod.findUnique({ where: { id } });
    if (!method) throw new NotFoundError("Phương thức thanh toán không tồn tại");

    // Kiểm tra ràng buộc toàn vẹn dữ liệu
    const [brandCount, restaurantCount, transactionCount, subTxCount] = await Promise.all([
        prisma.brandPaymentConfig.count({ where: { systemPaymentMethodId: id } }),
        prisma.restaurantPaymentConfig.count({ where: { systemPaymentMethodId: id } }),
        prisma.transaction.count({ where: { systemPaymentMethodId: id } }),
        prisma.brandSubscriptionTransaction.count({ where: { systemPaymentMethodId: id } }),
    ]);

    if (brandCount > 0 || restaurantCount > 0 || transactionCount > 0 || subTxCount > 0) {
        const reasons = [];
        if (brandCount > 0) reasons.push(`${brandCount} cấu hình thương hiệu`);
        if (restaurantCount > 0) reasons.push(`${restaurantCount} cấu hình nhà hàng`);
        if (transactionCount + subTxCount > 0) reasons.push(`${transactionCount + subTxCount} lịch sử giao dịch`);

        throw new ConflictError(
            `Không thể xóa phương thức "${method.name}" vì đang liên kết với ${reasons.join(", ")}. Vui lòng chuyển sang trạng thái "Tạm dừng (Inactive)" để bảo toàn dữ liệu kế toán!`
        );
    }

    return await deletePaymentMethodRepo(id);
};
