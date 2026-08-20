import { notificationsData } from "../constants/notifications.data.js";

export const notificationExtension = async (prisma) => {
    // 1. Lấy danh sách Reservation để lấy ID dựa trên reservationCode
    const reservations = await prisma.Reservations.findMany({
        select: {
            id: true,
            confirmation_code: true,
        }
    });

    // 2. Tạo Map để tra cứu nhanh: Key là reservationCode, Value là reservationId
    const mapReservation = new Map(
        reservations.map(res => [res.confirmation_code, res.id])
    );

    console.log("Creating Notifications ..........");

    // 3. Thực hiện insert hàng loạt
    const result = await prisma.Notifications.createMany({
        data: notificationsData.map(({ reservationCode, ...item }) => {
            const reservationId = mapReservation.get(reservationCode);
            
            // Kiểm tra nếu không tìm thấy mã đặt bàn trong DB
            if (!reservationId) {
                console.warn(`⚠️  Cảnh báo: Không tìm thấy ID cho mã ${reservationCode}`);
            }

            return {
                ...item,
                reservationId: reservationId // Gán ID đã tìm được vào đây
            };
        })
    });

    console.log(`✅ Đã tạo thành công ${result.count} notifications !`);
};