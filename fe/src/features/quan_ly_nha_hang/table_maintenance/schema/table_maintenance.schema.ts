import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const createTableMaintenanceSchema = z.object({
    restaurantId: validator.string("ID Nhà hàng"),
    tableIds: z.array(validator.string("ID Bàn")).min(1, "Vui lòng chọn ít nhất 1 bàn"),
    start_time: validator.string("Thời gian bắt đầu"),
    end_time: validator.string("Thời gian kết thúc"),
    reason: validator.string("Lý do bảo trì").optional()
});

export type CreateTableMaintenanceFormValues = z.infer<typeof createTableMaintenanceSchema>;
