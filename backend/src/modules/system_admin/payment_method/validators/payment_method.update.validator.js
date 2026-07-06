import { z } from 'zod';

export const updatePaymentMethodValidator = z.object({
    body: z.object({
        name: z.string().min(1, "Tên không được để trống").optional(),
        code: z.string().min(1, "Mã code không được để trống").toUpperCase().optional(),
        description: z.string().optional(),
        iconUrl: z.string().optional(),
        isActive: z.boolean().optional(),
        systemConfig: z.any().optional()
    }),
});
