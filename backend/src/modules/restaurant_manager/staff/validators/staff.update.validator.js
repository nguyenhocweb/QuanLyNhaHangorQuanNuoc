import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateStaffValidator = z.object({
  body: z.object({
    salary_type: z.enum(["HOURLY", "MONTHLY"]).optional().nullable(),
    roleName: demoValidator.chuoiKhongBatBuoc("Vai trò"),
    permissionIds: demoValidator.array("Danh sách quyền", demoValidator.chuoi("ID Quyền")).optional(),
  }),
});
