import { NotFoundError, BadRequestError, ForbiddenError } from "../../../../core/constants/error/index.js";
import { findReservationForOrderRepo, createOrAppendDineInOrderRepo } from "../order.repository/dine_in_order.create.repo.js";

export const createDineInOrderService = async (userId, { reservationId, items }) => {
    // 1. Kiểm tra tồn tại đặt bàn
    const reservation = await findReservationForOrderRepo(reservationId);
    if (!reservation) {
        throw new NotFoundError("Không tìm thấy thông tin đặt bàn");
    }

    // 2. Kiểm tra quyền sở hữu của khách hàng (nếu có userId)
    if (reservation.userId && userId && reservation.userId !== userId) {
        throw new ForbiddenError("Bạn không có quyền gọi món cho bàn đặt này");
    }

    // 3. Kiểm tra trạng thái bàn (Khách phải đang ở trạng thái SEATED hoặc CONFIRMED)
    if (['CANCELLED', 'NO_SHOW', 'COMPLETED'].includes(reservation.status)) {
        throw new BadRequestError("Lịch đặt bàn đã kết thúc hoặc bị hủy, không thể gọi món");
    }

    // 4. Tính toán tổng phụ
    const addedSubtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice) * Number(item.quantity)), 0);

    // 5. Thực hiện lưu đơn hàng
    const orderResult = await createOrAppendDineInOrderRepo({
        reservation,
        items,
        addedSubtotal
    });

    return {
        message: "Gửi yêu cầu gọi món thành công",
        metadata: orderResult
    };
};
