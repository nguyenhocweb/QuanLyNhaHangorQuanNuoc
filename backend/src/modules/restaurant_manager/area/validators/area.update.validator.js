import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";
import { isActive } from "../../../../databases/prisma/generated/prisma/client.js";

export const areaUpdateValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên khu vực").optional(),
        description: demoValidator.chuoiKhongBatBuoc("Mô tả").optional(),
        smoking_allowed: demoValidator.boolean("Cho phép hút thuốc").optional(),
        is_outdoor: demoValidator.boolean("Khu vực ngoài trời").optional(),
        floor_number: demoValidator.int("Tầng số").optional(),
        width: demoValidator.double("Chiều rộng canvas", 0, 10000).optional(),
        height: demoValidator.double("Chiều cao canvas", 0, 10000).optional(),
        background_url: demoValidator.chuoiKhongBatBuoc("URL Ảnh nền").optional(),
        obstacles: z.array(z.any()).optional(),
        is_active: z.nativeEnum(isActive).optional()
    })
});
