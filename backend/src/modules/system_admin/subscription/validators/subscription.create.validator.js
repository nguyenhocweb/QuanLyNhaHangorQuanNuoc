import { z } from "zod";

export const createSubscriptionValidator = z.object({
  body: z.object({
    name: z.string().min(1, "Tên gói cước là bắt buộc"),
    description: z.string().optional(),
    price: z.number().min(0, "Giá không được nhỏ hơn 0"),
    discountPrice: z.number().nullable().optional(),
    discountStartDate: z.string().nullable().optional(),
    discountEndDate: z.string().nullable().optional(),
    billingCycle: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]),
    maxRestaurants: z.number(),
    trialPeriodDays: z.number().int().min(0).default(0),
    setupFee: z.number().min(0).default(0),
    featuresData: z.record(z.string(), z.any()).optional().nullable(),
    isPublic: z.boolean().default(true),
    isActive: z.boolean().default(true),
  })
});
