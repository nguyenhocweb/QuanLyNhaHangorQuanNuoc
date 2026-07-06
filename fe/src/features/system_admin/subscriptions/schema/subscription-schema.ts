import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const subscriptionSchema = z.object({
  name: validator.string("Tên gói cước", 255, 1),
  description: z.string().optional(),
  price: validator.number("Giá tiền", 0, 1_000_000_000),
  discountPrice: validator.number("Giá khuyến mãi", 0, 1_000_000_000).optional().or(z.literal("").transform(() => undefined)),
  discountStartDate: validator.date("Ngày bắt đầu KM").optional().or(z.literal("").transform(() => undefined)),
  discountEndDate: validator.date("Ngày kết thúc KM").optional().or(z.literal("").transform(() => undefined)),
  billingCycle: validator.enum("Chu kỳ thanh toán", ['MONTHLY', 'YEARLY', 'LIFETIME']),
  maxRestaurants: validator.number("Giới hạn số nhà hàng", -1),
  features: validator.array("Các tính năng", validator.string("Tính năng", 255, 1), { min: 1 }),
  isActive: z.boolean().default(true),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
