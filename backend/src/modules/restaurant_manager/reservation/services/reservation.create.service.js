import { createReservationRepo } from "../repositories/reservation.create.repo.js";
import { ConflictError } from "../../../../core/constants/error/index.js";
import { emitReservationUpdate } from "../../../../core/utils/socket.js";
import { notifyCustomerReservationChange } from "../utils/reservation.notification.js";
import { prisma } from "../../../../databases/init.mongodb.js";

const formatDateVN = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export const createReservationService = async (restaurantId, staffId, data) => {
    // Có thể thêm check logic: vd ko cho đặt giờ trong quá khứ
    const reservationDate = new Date(data.reservation_date);
    const now = new Date();
    
    // So sánh ngày (bỏ qua giờ)
    reservationDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    if (reservationDate < now) {
        throw new ConflictError("Không thể đặt bàn cho ngày trong quá khứ.");
    }

    const result = await createReservationRepo(restaurantId, staffId, data);
    emitReservationUpdate(restaurantId);

    // Gửi thông báo cho khách nếu có thông tin tài khoản khách hàng
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { name: true }
    });

    const resName = restaurant?.name || "nhà hàng";
    const dateStr = formatDateVN(result.reservation_date);

    notifyCustomerReservationChange({
        reservation: result,
        title: "Tạo đơn đặt bàn thành công",
        body: `Bạn có một đơn đặt bàn mới tại "${resName}" vào lúc ${result.start_time} ngày ${dateStr} (Mã đặt bàn: ${result.confirmation_code}).`,
        type: "CONFIRMATION"
    });

    return result;
};

