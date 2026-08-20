import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const tableAvailabilityValidator = z.object({
    body: z.object({
        reservation_date: demoValidator.event_date("Ngày đến", -1, 365), // Cho phép lệch 1 ngày do timezone
        start_time: demoValidator.chuoi("Giờ đến"), // Định dạng HH:mm
        end_time: demoValidator.chuoiKhongBatBuoc("Giờ đi"), // Định dạng HH:mm
        party_size: demoValidator.int("Số lượng khách", 1, 100).optional(),
    })
});
