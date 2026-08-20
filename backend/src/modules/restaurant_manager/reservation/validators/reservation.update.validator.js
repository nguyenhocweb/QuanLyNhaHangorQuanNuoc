import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

const occasionEnum = ["NORMAL", "BIRTHDAY", "ANNIVERSARY", "BUSINESS", "DATE", "OTHER"];
const statusEnum = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export const reservationUpdateValidator = z.object({
    body: z.object({
        guest_name: demoValidator.chuoi("Tên khách hàng").optional(),
        guest_phone: demoValidator.soDienThoai().optional(),
        guest_email: demoValidator.email("Email").optional().or(z.literal('')),
        reservation_date: demoValidator.event_date("Ngày đến", 0, 365).optional(),
        start_time: demoValidator.chuoi("Giờ đến").optional(),
        end_time: demoValidator.chuoi("Giờ đi").optional(),
        party_size: demoValidator.int("Số lượng khách", 1, 100).optional(),
        occasion: demoValidator.enum("Dịp", occasionEnum).optional(),
        special_requests: demoValidator.chuoiKhongBatBuoc("Yêu cầu đặc biệt"),
        internal_notes: demoValidator.chuoiKhongBatBuoc("Ghi chú nội bộ"),
        table_ids: z.array(z.string()).optional()
    })
});

export const reservationStatusValidator = z.object({
    body: z.object({
        status: demoValidator.enum("Trạng thái", statusEnum),
        cancellation_reason: demoValidator.chuoiKhongBatBuoc("Lý do hủy") // Chỉ cần khi status = CANCELLED
    })
});

export const reservationAssignValidator = z.object({
    body: z.object({
        tableId: demoValidator.chuoi("Bàn")
    })
});
