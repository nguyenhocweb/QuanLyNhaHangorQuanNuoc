import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

const imageAcceptTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
] as const;

export const UpdateBrandSchema = z.object({
    name: validator.string("Tên thương hiệu", 255, 1),
    tax_code: validator.string("Mã số thuế", 100, 1).optional().or(z.literal("")),
    email_contact: validator.email().optional().or(z.literal("")),
    phone_contact: validator.phone().optional().or(z.literal("")),
    link: z.preprocess(
        (input) => {
            if (typeof input !== "string") return undefined;
            const trimmed = input.trim();
            return trimmed === "" ? undefined : trimmed;
        },
        validator.url("Website/Link").optional()
    ),
    address: z.object({
        street: z.string().optional(),
        ward: z.string().optional(),
        wardCode: z.string().optional(),
        district: z.string().optional(),
        districtCode: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional()
    }).optional(),
    is_featured: validator.boolean("Thương hiệu tiêu biểu").optional(),
    FileLogo: validator.file("Logo thương hiệu", {
        maxSizeMB: 5,
        acceptedTypes: [...imageAcceptTypes],
    }).optional(),
    FileImageMain: validator.file("Ảnh bìa chính", {
        maxSizeMB: 5,
        acceptedTypes: [...imageAcceptTypes],
    }).optional(),
    FileImages: z.array(z.any()).optional(),
});

export type UpdateBrandFormValues = z.infer<typeof UpdateBrandSchema>;
