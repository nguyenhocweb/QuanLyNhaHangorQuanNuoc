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
    features: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
  })
});
