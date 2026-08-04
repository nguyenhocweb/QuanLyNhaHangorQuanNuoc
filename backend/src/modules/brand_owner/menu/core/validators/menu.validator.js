import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const createMenuValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên thực đơn"),
        description: z.string().optional(),
        is_active: z.boolean().default(true),
        sort_order: z.number().int().default(0)
    })
});

export const updateMenuValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Thực đơn")
    }),
    body: z.object({
        name: demoValidator.chuoi("Tên thực đơn").optional(),
        description: z.string().optional(),
        is_active: z.boolean().optional(),
        sort_order: z.number().int().optional()
    })
});

export const deleteMenuValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Thực đơn")
    })
});
