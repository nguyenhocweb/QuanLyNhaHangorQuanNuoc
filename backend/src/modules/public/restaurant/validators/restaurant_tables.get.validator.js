import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const getAvailableTablesValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("Restaurant ID").regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ"),
    }),
    query: z.object({
        date: demoValidator.chuoi("Ngày đặt"), 
        startTime: demoValidator.chuoi("Giờ bắt đầu"),
        endTime: demoValidator.chuoi("Giờ kết thúc"),
        partySize: demoValidator.int("Số người", 1, 100),
    }),
});
