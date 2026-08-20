import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";
import { TableType, TableShape, TableStatus } from "../../../../databases/prisma/generated/prisma/client.js";

export const tableUpdateValidator = z.object({
    body: z.object({
        table_number: demoValidator.chuoi("Số/Tên bàn").optional(),
        table_type: z.nativeEnum(TableType).optional(),
        min_capacity: demoValidator.int("Sức chứa tối thiểu", 1).optional(),
        max_capacity: demoValidator.int("Sức chứa tối đa", 1).optional(),
        is_vip: demoValidator.boolean("VIP").optional(),
        shape: z.enum(["ROUND", "RECT", "LONG", "SQUARE", "CIRCLE", "OVAL", "TRIANGLE", "HEXAGON", "STAR", "LINE"]).optional(),
        color: demoValidator.chuoi("Màu sắc").optional(),
        is_combinable: demoValidator.boolean("Có thể ghép bàn").optional(),
        width: demoValidator.double("Chiều rộng bàn").optional(),
        height: demoValidator.double("Chiều cao bàn").optional(),
        rotation: demoValidator.double("Góc xoay").optional(),
        status: z.nativeEnum(TableStatus).optional(),
        pos_x: demoValidator.double("Tọa độ X").optional(),
        pos_y: demoValidator.double("Tọa độ Y").optional(),
    })
});
