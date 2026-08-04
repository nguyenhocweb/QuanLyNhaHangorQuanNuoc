import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const templateSchema = z.object({
    name: validator.string("Tên mẫu giao diện", 255, 2),
    code: validator.string("Mã giao diện", 255, 2),
    type: validator.enum("Loại giao diện", ["BRAND_TEMPLATE", "RESTAURANT_TEMPLATE"]),
    thumbnailUrl: validator.string("Ảnh đại diện", 1000, 0).optional().nullable(),
    description: validator.string("Mô tả", 1000, 0).optional().nullable(),
    desktopImages: z.array(z.string()).default([]),
    tabletImages: z.array(z.string()).default([]),
    mobileImages: z.array(z.string()).default([]),
    isActive: validator.boolean("Trạng thái"),
    allowedPlanIds: validator.array("Gói cước ID", validator.string("ID")).optional(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
