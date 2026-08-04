import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateRestaurantValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID nhà hàng")
    }),
    body: z.object({
        name: demoValidator.chuoi("Tên chi nhánh").optional(),
        email_contact: demoValidator.email().optional().or(z.literal("")),
        phone_contact: demoValidator.soDienThoai().optional().or(z.literal("")),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            district: z.string().optional(),
            ward: z.string().optional(),
        }).optional().or(z.any()),
        city: demoValidator.chuoi("Thành phố").optional().or(z.literal("")),
        imageMain: demoValidator.chuoi("Hình ảnh chính").optional(),
        logo: demoValidator.chuoi("Logo").optional().or(z.literal("")),
        statusByBrand: z.enum(["ACTIVE", "INACTIVE", "PENDING", "BANNED", "REJECTED"]).optional(),
        categoryIds: z.array(demoValidator.chuoi("ID danh mục")).optional(),
        amenityIds: z.array(demoValidator.chuoi("ID tiện ích")).optional(),
        max_party_size: z.number().int().min(1).optional(),
        booking_window_days: z.number().int().min(0).optional(),
        cancellation_hours: z.number().int().min(0).optional(),
        deposit_required: z.boolean().optional(),
        deposit_amount: z.number().int().min(0).optional().nullable(),
    })
});
