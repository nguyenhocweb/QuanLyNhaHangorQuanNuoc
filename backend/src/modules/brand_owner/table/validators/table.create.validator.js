import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";
import { TableShape } from "../../../../databases/prisma/generated/prisma/client.js";

export const tableCreateValidator = z.object({
    body: z.object({
        restaurantId: demoValidator.chuoi("ID Nhà hàng"),
        areaId: demoValidator.chuoi("ID Khu vực"),
        table_number: demoValidator.chuoi("Số/Tên bàn"),
        table_type: z.enum(["STANDARD", "VIP"]).optional().default("STANDARD"),
        min_capacity: demoValidator.int("Sức chứa tối thiểu", 1),
        max_capacity: demoValidator.int("Sức chứa tối đa", 1),
        is_vip: demoValidator.boolean("VIP").optional().default(false),
        shape: z.enum(["ROUND", "RECT", "LONG", "SQUARE", "CIRCLE", "OVAL", "TRIANGLE", "HEXAGON", "STAR", "LINE"]).optional(),
        color: demoValidator.chuoi("Màu sắc").optional(),
        is_combinable: demoValidator.boolean("Có thể ghép bàn").optional().default(false),
        width: demoValidator.double("Chiều rộng bàn").optional().default(80),
        height: demoValidator.double("Chiều cao bàn").optional().default(80),
        rotation: demoValidator.double("Góc xoay").optional().default(0),
    })
});
