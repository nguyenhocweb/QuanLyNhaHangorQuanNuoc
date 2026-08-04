import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const updateMyBrandSchema = z.object({
    name: validator.string("Tên thương hiệu"),
    tax_code: validator.string("Mã số thuế", 100).optional().or(z.literal("")),
    email_contact: validator.email().optional().or(z.literal("")),
    phone_contact: validator.phone().optional().or(z.literal("")),
    link: validator.url("Website/Link").optional().or(z.literal("")),
    address: validator.object("Địa chỉ", {
        street: z.string().optional(),
        ward: z.string().optional(),
        wardCode: z.string().optional(),
        district: z.string().optional(),
        districtCode: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional()
    }).optional(),
    is_featured: validator.boolean("Nổi bật").optional(),
    FileLogo: validator.file("Logo thương hiệu").optional().or(z.any().optional()),
    FileImageMain: validator.file("Ảnh bìa chính").optional().or(z.any().optional()),
});

export type UpdateMyBrandFormValues = z.infer<typeof updateMyBrandSchema>;
