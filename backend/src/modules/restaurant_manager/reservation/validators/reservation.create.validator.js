import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

// Lấy danh sách enum từ Prisma Enum nếu cần, nhưng validator tự định nghĩa cũng được
const reservationSourceEnum = ["WEB", "MOBILE", "PHONE", "WALK_IN", "THIRD_PARTY"];
const occasionEnum = ["NORMAL", "BIRTHDAY", "ANNIVERSARY", "BUSINESS", "DATE", "OTHER"];

export const reservationCreateValidator = z.object({
    body: z.object({
        guest_name: demoValidator.chuoi("Tên khách hàng"),
        guest_phone: demoValidator.soDienThoai(),
        guest_email: demoValidator.email("Email").optional().or(z.literal('')),
        reservation_date: demoValidator.event_date("Ngày đến", 0, 365), // Đặt trước tối đa 1 năm, >= hôm nay
        start_time: demoValidator.chuoi("Giờ đến"), // Định dạng HH:mm
        end_time: demoValidator.chuoi("Giờ đi").optional(), // Có thể backend tự tính dựa trên start_time + 2 tiếng
        party_size: demoValidator.int("Số lượng khách", 1, 100),
        source: demoValidator.enum("Nguồn đặt bàn", reservationSourceEnum).optional().default("WALK_IN"),
        occasion: demoValidator.enum("Dịp", occasionEnum).optional().default("NORMAL"),
        special_requests: demoValidator.chuoiKhongBatBuoc("Yêu cầu đặc biệt"),
        internal_notes: demoValidator.chuoiKhongBatBuoc("Ghi chú nội bộ"),
        table_ids: z.array(z.string()).optional()
    })
});
