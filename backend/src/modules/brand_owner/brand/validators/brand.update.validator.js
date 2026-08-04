import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateBrandValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên thương hiệu"),
        tax_code: z.string().max(100, "Mã số thuế không được vượt quá 100 ký tự").optional().or(z.literal("")),
        email_contact: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
        phone_contact: z.string().max(20, "Số điện thoại không được vượt quá 20 ký tự").optional().or(z.literal("")),
        link: z.string().url("Website/Link không hợp lệ").max(255, "Website/Link không được vượt quá 255 ký tự").optional().or(z.literal("")),
        address: z.object({
            street: z.string().optional(),
            ward: z.string().optional(),
            wardCode: z.string().optional(),
            district: z.string().optional(),
            districtCode: z.string().optional(),
            province: z.string().optional(),
            provinceCode: z.string().optional()
        }).optional(),
        is_featured: z.boolean().optional(),
        logo: z.string().url("Logo URL không hợp lệ").optional(),
        imageMain: z.string().url("Image URL không hợp lệ").optional()
    })
});
