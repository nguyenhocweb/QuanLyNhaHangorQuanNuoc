import { z } from "zod";

export const upsertConfigValidator = z.object({
    params: z.object({
        systemPaymentMethodId: z.string()
    }),
    body: z.object({
        configData: z.any(),
        isActive: z.boolean().optional().default(true)
    })
});
