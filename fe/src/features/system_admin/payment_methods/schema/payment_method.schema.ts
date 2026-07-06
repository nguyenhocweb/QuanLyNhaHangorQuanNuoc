import * as z from "zod";

export const paymentMethodSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên phương thức thanh toán"),
    code: z.string().min(1, "Vui lòng nhập mã code (Ví dụ: MOMO, VNPAY)"),
    description: z.string().optional(),
    iconUrl: z.string().optional(),
    isActive: z.boolean().default(true),
    systemConfig: z.any().optional(),
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
