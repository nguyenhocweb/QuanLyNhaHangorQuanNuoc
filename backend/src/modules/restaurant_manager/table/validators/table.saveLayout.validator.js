import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const tableSaveLayoutValidator = z.object({
    body: z.object({
        tables: z.array(z.object({
            id: demoValidator.chuoi("ID Bàn"),
            pos_x: demoValidator.double("Tọa độ X"),
            pos_y: demoValidator.double("Tọa độ Y"),
            rotation: demoValidator.double("Góc xoay").optional()
        }))
    })
});
