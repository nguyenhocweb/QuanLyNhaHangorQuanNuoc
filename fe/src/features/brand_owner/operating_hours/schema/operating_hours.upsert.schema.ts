import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const timeSchema = z.string()
    .regex(timeRegex, "Giờ phải theo định dạng HH:mm")
    .optional()
    .nullable();

const operatingHourItemSchema = z.object({
    day_of_week: validator.number("Ngày trong tuần", 0, 6),
    is_closed: validator.boolean("Trạng thái đóng cửa"),
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
    message: "Giờ nghỉ trưa (bắt đầu) phải nhỏ hơn giờ nghỉ trưa (kết thúc)",
    path: ["break_start"]
}).refine((data) => {
    if (!data.is_closed && data.open_time && data.close_time) {
        return data.open_time < data.close_time;
    }
    return true;
}, {
    message: "Giờ mở cửa phải trước giờ đóng cửa",
    path: ["open_time"]
});

export const upsertOperatingHoursSchema = z.object({
    operating_hours: z.array(operatingHourItemSchema).length(7)
});

export type UpsertOperatingHoursFormValues = z.infer<typeof upsertOperatingHoursSchema>;
