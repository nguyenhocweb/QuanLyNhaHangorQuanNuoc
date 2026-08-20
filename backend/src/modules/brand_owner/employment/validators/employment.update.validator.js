import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateEmploymentValidator = z.object({
  body: z.object({
    restaurantId: demoValidator.chuoiKhongBatBuoc("Chi nhánh"),
    isManager: z.boolean().optional().default(false),
    permissionIds: demoValidator.array("Danh sách quyền", demoValidator.chuoi("ID Quyền")).optional().default([]),
  })
});
