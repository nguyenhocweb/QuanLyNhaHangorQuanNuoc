import { z } from 'zod';

export const createPaymentMethodValidator = z.object({
    body: z.object({
        name: z.string({ required_error: "Tên phương thức không được để trống" }).min(1, "Tên không được để trống"),
        code: z.string({ required_error: "Mã code không được để trống" }).min(1, "Mã code không được để trống").toUpperCase(),
        description: z.string().optional(),
        iconUrl: z.string().optional(),
        isActive: z.boolean().optional()
    }),
});
