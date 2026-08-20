import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const tableMaintenanceCreateValidator = z.object({
    body: z.object({
        restaurantId: demoValidator.chuoi("ID Nhà hàng"),
        tableIds: z.array(demoValidator.chuoi("ID bàn")).min(1, "Vui lòng chọn ít nhất 1 bàn"),
        start_time: demoValidator.chuoi("Thời gian bắt đầu"),
        end_time: demoValidator.chuoi("Thời gian kết thúc"),
        reason: demoValidator.chuoi("Lý do bảo trì").optional()
    })
});

export const tableMaintenanceUpdateValidator = z.object({
    body: z.object({
        status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
        start_time: demoValidator.chuoi("Thời gian bắt đầu").optional(),
        end_time: demoValidator.chuoi("Thời gian kết thúc").optional(),
        reason: demoValidator.chuoi("Lý do bảo trì").optional(),
        tableIds: z.array(demoValidator.chuoi("ID bàn")).min(1, "Vui lòng chọn ít nhất 1 bàn").optional()
    })
});
