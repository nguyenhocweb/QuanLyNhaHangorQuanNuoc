import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const menuCoreSchema = z.object({
    name: validator.string("Tên thực đơn"),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
    sort_order: z.coerce.number().int().default(0)
});

export type MenuCoreFormValues = z.infer<typeof menuCoreSchema>;

export interface MenuData {
    id: string;
    brandId: string;
    name: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
}
