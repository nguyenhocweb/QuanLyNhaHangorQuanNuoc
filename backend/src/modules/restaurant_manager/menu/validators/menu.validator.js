import { z } from "zod";

export const menuUpdateValidator = z.object({
    body: z.object({
        isAvailable: z.boolean({ invalid_type_error: "Trạng thái còn hàng phải là kiểu boolean" }).optional(),
        overridePrice: z.number({ invalid_type_error: "Giá bán phải là số" }).min(0, "Giá bán không được âm").nullable().optional()
    })
});
