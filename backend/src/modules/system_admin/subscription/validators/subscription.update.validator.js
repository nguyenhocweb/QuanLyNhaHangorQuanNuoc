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
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  })
});
