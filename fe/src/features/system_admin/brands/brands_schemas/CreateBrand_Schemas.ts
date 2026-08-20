import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

const imageAcceptTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
] as const;

export const CreateBrandSchema = z.object({
    name: validator.string("Tên thương hiệu", 255, 2),
    taxCode: validator.string("Mã số thuế", 100, 3),
    description: z.string().max(2000, "Mô tả không được vượt quá 2000 ký tự").optional(),
    emailContact: validator.email(),
    phoneContact: validator.phone(),
    link: z.preprocess(
        (input) => {
            if (typeof input !== "string") return undefined;
            const trimmed = input.trim();
            return trimmed === "" ? undefined : trimmed;
        },
        z.string()
            .url("Website/Link phải là một đường dẫn hợp lệ (vd: http://... hoặc https://...)")
            .max(255, "Website/Link không được vượt quá 255 ký tự")
            .optional()
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
    FileLogo: validator.file("Logo thương hiệu", {
        maxSizeMB: 5,
        acceptedTypes: [...imageAcceptTypes],
    }),
    FileImageMain: validator.file("Ảnh bìa chính", {
        maxSizeMB: 5,
        acceptedTypes: [...imageAcceptTypes],
    }),
    brand_owner_id: validator.string("Chủ sở hữu thương hiệu"),
    is_featured: validator.boolean("Thương hiệu tiêu biểu"),
    FileImages: z.array(z.any()).optional(),
    
});  
export type CreateBrandFormValues = z.infer<typeof CreateBrandSchema>;
