import { z } from "zod";

export const updateSubscriptionValidator = z.object({
  body: z.object({
    name: z.string().min(1, "Tên gói cước là bắt buộc").optional(),
    description: z.string().optional(),
    price: z.number().min(0, "Giá không được nhỏ hơn 0").optional(),
    discountPrice: z.number().nullable().optional(),
    discountStartDate: z.string().nullable().optional(),
    discountEndDate: z.string().nullable().optional(),
    billingCycle: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]).optional(),
    maxRestaurants: z.number().optional(),
    trialPeriodDays: z.number().int().min(0).optional(),
    setupFee: z.number().min(0).optional(),
    featuresData: z.record(z.string(), z.any()).optional().nullable(),
    isPublic: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
});
