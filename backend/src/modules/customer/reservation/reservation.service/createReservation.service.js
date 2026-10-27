import Create_chuoi from "../../../../core/utils/Create_chuoi.js";
import { createReservation } from "../reservation.repository/index.js";
import { calculateEndTime } from "../../../../core/utils/calculateEndTime.js";
import { Prisma } from "../../../../databases/prisma/generated/prisma/index.js";
import { emitReservationUpdate } from "../../../../core/utils/socket.js";
import { pushNotificationService } from "../../../shared/notifications/services/notification.push.service.js";

const formatDateVN = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export const createReservationService = async (data) => {
        const initial = data.guest_name
                .split(/\s+/)            // Tách chuỗi bởi khoảng trắng
                .map(word => word[0])    // Lấy ký tự đầu của mỗi từ
                .join("")                // Ghép lại thành chuỗi
                .toUpperCase();

        if (!data.end_time) {
                data.end_time = calculateEndTime(data.start_time, 3)
        }

        for (var i = 0; i < 3; i++) {
                try {
                        const confirmation_code = Create_chuoi(initial, 12);
                        data.confirmation_code = confirmation_code;
                        const result = await createReservation(data);
                        
                        emitReservationUpdate(data.restaurantId);

                        // Thông báo đến nhà hàng
                        pushNotificationService.pushToRestaurant({
                                restaurantIds: [data.restaurantId],
                                title: "Có đơn đặt bàn mới cần duyệt! 🛎️",
                                body: `Khách hàng ${data.guest_name} (${data.guest_phone}) vừa đặt bàn lúc ${data.start_time} ngày ${formatDateVN(data.reservation_date)} (${data.party_size} khách). Mã: ${confirmation_code}.`,
                                type: "RESERVATION",
                                referenceId: result.id,
                                referenceType: "RESERVATION"
                        }).catch(e => console.error("Error notifying restaurant:", e));

                        // Thông báo đến khách hàng (nếu khách đã đăng nhập)
                        if (data.userId) {
                                pushNotificationService.pushToCustomer({
                                        userIds: [data.userId],
                                        title: "Yêu cầu đặt bàn đã được gửi",
                                        body: `Yêu cầu đặt bàn lúc ${data.start_time} ngày ${formatDateVN(data.reservation_date)} đã được gửi đến nhà hàng. Mã đặt bàn: ${confirmation_code}.`,
                                        type: "CONFIRMATION",
                                        referenceId: result.id,
                                        referenceType: "RESERVATION"
                                }).catch(e => console.error("Error notifying customer:", e));
                        }

                        return { code: 201, mes: "đã tạo thành công" };
                } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                                if (error.code === 'P2002') {
                                        // Kiểm tra xem có phải trùng ở field confirmation_code không
                                        const target = error.meta?.target;
                                        if (target?.includes('confirmation_code')) {
                                                console.warn(`Lần thử ${i + 1}: Trùng mã ${data.confirmation_code}, đang thử lại...`);
                                                continue;
                                        }
                                }
                        }
                        console.error(error);
                        return { code: 409, mes: "Dữ liệu bị trùng" };
                }
        }
};
 