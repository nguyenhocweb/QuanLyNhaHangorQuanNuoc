import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // Format HH:mm

const timeSchema = z.string().regex(timeRegex, "Thời gian phải có định dạng HH:mm").optional().nullable();

const operatingHourItemSchema = z.object({
    day_of_week: demoValidator.int("Ngày trong tuần", 0, 6),
    is_closed: demoValidator.boolean("Trạng thái đóng cửa"),
    open_time: timeSchema,
    close_time: timeSchema,
    break_start: timeSchema,
    break_end: timeSchema,
}).refine((data) => {
    if (!data.is_closed) {
        if (!data.open_time || !data.close_time) return false;
    }
    return true;
}, {
    message: "Phải nhập giờ mở cửa và đóng cửa nếu ngày đó hoạt động",
    path: ["open_time"]
}).refine((data) => {
    if (data.break_start && data.break_end) {
        return data.break_start < data.break_end;
    }
    return true;
}, {
    message: "Giờ bắt đầu nghỉ phải nhỏ hơn giờ kết thúc nghỉ",
    path: ["break_start"]
}).refine((data) => {
    if (!data.is_closed && data.open_time && data.close_time) {
        return data.open_time < data.close_time;
    }
    return true;
}, {
    message: "Giờ mở cửa phải nhỏ hơn giờ đóng cửa",
    path: ["open_time"]
});

export const upsertOperatingHoursValidator = z.object({
    body: z.object({
        operating_hours: z.array(operatingHourItemSchema).length(7, "Phải cung cấp cấu hình cho đúng 7 ngày trong tuần")
    })
});
