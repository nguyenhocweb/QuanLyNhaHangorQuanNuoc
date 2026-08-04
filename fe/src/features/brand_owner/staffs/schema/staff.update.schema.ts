import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const updateStaffSchema = z.object({
  restaurantId: z.string().optional(),
  isManager: z.boolean().optional().default(false),
  permissionIds: validator.array("Danh sách quyền", validator.string("ID Quyền")).optional().default([]),
});

export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;
