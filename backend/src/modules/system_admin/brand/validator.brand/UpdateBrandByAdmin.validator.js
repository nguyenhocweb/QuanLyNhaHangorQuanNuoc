import z from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateBrandBasicByAdminValidator = z.object({
    params: z.object({
        _id: demoValidator.chuoi("Mã thương hiệu", 1, 255),
    }),
    body: z.object({
        name: demoValidator.chuoi("Tên thương hiệu").optional(),
        tax_code: z.preprocess((val) => val === "" ? undefined : val, demoValidator.chuoi("Mã số thuế").max(100, "Mã số thuế không được vượt quá 100 ký tự").optional().nullable()),
        email_contact: z.preprocess((val) => val === "" ? undefined : val, demoValidator.email().optional().nullable()),
        phone_contact: z.preprocess((val) => val === "" ? undefined : val, demoValidator.chuoi("Số điện thoại liên hệ").max(20, "Số điện thoại không được vượt quá 20 ký tự").optional().nullable()),
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
        ).optional().nullable(),
        address: z.object({
            street: z.string().optional(),
            ward: z.string().optional(),
            wardCode: z.string().optional(),
            district: z.string().optional(),
            districtCode: z.string().optional(),
            province: z.string().optional(),
            provinceCode: z.string().optional()
        }).optional().nullable(),
        brand_owner_id: demoValidator.chuoi("Chủ sở hữu thương hiệu").optional(),
        is_featured: demoValidator.boolean("Thương hiệu tiêu biểu").optional(),
        isActive: z.enum(["ACTIVE", "PENDING", "INACTIVE", "TERMINATED"]).optional()
    })
});

export default updateBrandBasicByAdminValidator;
