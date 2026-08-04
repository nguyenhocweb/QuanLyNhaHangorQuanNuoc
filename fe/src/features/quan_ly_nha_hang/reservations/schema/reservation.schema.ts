import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const reservationFormSchema = z.object({
    guest_name: validator.string("Tên khách hàng", 100),
    guest_phone: validator.phone(),
    guest_email: validator.email().optional().or(z.literal('')),
    party_size: validator.number("Số lượng khách", 1, 100),
    reservation_date: validator.date("Ngày đến", { minDate: new Date() }),
    start_time: validator.string("Giờ đến", 5, 5), // HH:mm
    end_time: validator.string("Giờ đi", 5, 5).optional().or(z.literal('')),
    source: z.enum(["WEB", "MOBILE", "PHONE", "WALK_IN", "THIRD_PARTY"]).optional(),
    occasion: z.enum(["NORMAL", "BIRTHDAY", "ANNIVERSARY", "BUSINESS", "DATE", "OTHER"]).optional(),
    special_requests: validator.string("Yêu cầu đặc biệt", 500).optional().or(z.literal('')),
    internal_notes: validator.string("Ghi chú nội bộ", 500).optional().or(z.literal('')),
    table_ids: z.array(z.string()).optional()
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
