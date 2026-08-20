import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const areaCreateValidator = z.object({
    body: z.object({
        restaurantId: demoValidator.chuoi("ID Nhà hàng"),
        name: demoValidator.chuoi("Tên khu vực"),
        description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
        smoking_allowed: demoValidator.boolean("Cho phép hút thuốc").optional().default(true),
        is_outdoor: demoValidator.boolean("Khu vực ngoài trời").optional().default(false),
        floor_number: demoValidator.int("Tầng số").optional().default(1),
        width: demoValidator.double("Chiều rộng canvas", 0, 10000).optional().default(1200),
        height: demoValidator.double("Chiều cao canvas", 0, 10000).optional().default(800),
        background_url: demoValidator.chuoiKhongBatBuoc("URL Ảnh nền"),
    })
});
