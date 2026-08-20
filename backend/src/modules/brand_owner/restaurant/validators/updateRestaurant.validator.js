import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateRestaurantValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID nhà hàng")
    }),
    body: z.object({
        name: demoValidator.chuoi("Tên chi nhánh").optional(),
        emailContact: demoValidator.email().optional().or(z.literal("")),
        phoneContact: demoValidator.soDienThoai().optional().or(z.literal("")),
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
        maxPartySize: z.number().int().min(1).optional(),
        bookingWindowDays: z.number().int().min(0).optional(),
        cancellationHours: z.number().int().min(0).optional(),
        depositRequired: z.boolean().optional(),
        depositPerPax: z.number().int().min(0).optional().nullable(),
        isVatInclusive: z.boolean().optional(),
        defaultVatRate: z.number().min(0).max(100).optional(),
        applyServiceCharge: z.boolean().optional(),
        serviceChargeRate: z.number().min(0).max(100).optional(),
    })
});
