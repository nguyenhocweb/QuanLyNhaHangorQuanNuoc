import z from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createBrandBasicByAdminValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên thương hiệu"),
        tax_code: demoValidator.chuoi("Mã số thuế").max(100, "Mã số thuế không được vượt quá 100 ký tự"),
        description: z.string().optional().nullable(),
        email_contact: demoValidator.email(),
        phone_contact: demoValidator.chuoi("Số điện thoại liên hệ").max(20, "Số điện thoại không được vượt quá 20 ký tự"),
        link: z.preprocess(
            (value) => {
                if (typeof value !== "string") return undefined;
                const trimmed = value.trim();
                return trimmed === "" ? undefined : trimmed;
            },
            z.string()
                .url("Website/Link không hợp lệ")
                .max(255, "Website/Link không được vượt quá 255 ký tự")
                .optional()
        ).optional(),
        address: z.object({
            street: z.string().optional(),
            ward: z.string().optional(),
            wardCode: z.string().optional(),
            district: z.string().optional(),
            districtCode: z.string().optional(),
            province: z.string().optional(),
            provinceCode: z.string().optional()
        }).optional().nullable(),
        brand_owner_id: demoValidator.chuoi("Chủ sở hữu thương hiệu"),
        is_featured: demoValidator.boolean("Thương hiệu tiêu biểu"),
    })
});

export const createBrandImageLinksValidator = z.object({
    params: z.object({
        _id: demoValidator.chuoi("Mã thương hiệu", 1, 255),
    }),
    body: z.object({
        logo: z.string().url("Logo phải là một đường dẫn hợp lệ").max(1000, "Logo không được vượt quá 1000 ký tự").optional().nullable(),
        imageMain: z.string().url("Ảnh bìa chính phải là một đường dẫn hợp lệ").max(1000, "Ảnh bìa chính không được vượt quá 1000 ký tự").optional().nullable(),
        images: z.array(
            z.string().url("Mỗi ảnh phải là một đường dẫn hợp lệ")
        ).optional(),
    }),
});

export default createBrandBasicByAdminValidator;
