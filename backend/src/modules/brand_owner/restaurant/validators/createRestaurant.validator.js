import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createRestaurantValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên chi nhánh"),
        emailContact: demoValidator.email().optional().or(z.literal("")),
        phoneContact: demoValidator.soDienThoai().optional().or(z.literal("")),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            district: z.string().optional(),
            ward: z.string().optional(),
        }).optional().or(z.any()),
        city: demoValidator.chuoi("Thành phố").optional().or(z.literal("")),
        description: demoValidator.chuoi("Mô tả").optional().or(z.literal("")),
        imageMain: demoValidator.chuoi("Hình ảnh chính"),
        logo: demoValidator.chuoi("Logo").optional().or(z.literal("")),
        images: z.array(z.string()).optional(),
        categoryIds: z.array(demoValidator.chuoi("ID danh mục")).optional(),
        amenityIds: z.array(demoValidator.chuoi("ID tiện ích")).optional(),
        tagIds: z.array(demoValidator.chuoi("ID nhãn")).optional(),
        maxPartySize: z.number().int().min(1).optional(),
        bookingWindowDays: z.number().int().min(0).optional(),
        cancellationHours: z.number().int().min(0).optional(),
        depositRequired: z.boolean().optional(),
        depositPerPax: z.number().int().min(0).optional(),
    })
});
