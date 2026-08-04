import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createEmploymentValidator = z.object({
  body: z.object({
    userId: demoValidator.chuoiKhongBatBuoc("ID Người dùng"),
    name: demoValidator.chuoi("Tên nhân viên").optional().or(z.literal("")),
    email: demoValidator.email("Email").optional().or(z.literal("")),
    password: demoValidator.password("Mật khẩu").optional().or(z.literal("")),
    phone: demoValidator.chuoiKhongBatBuoc("Số điện thoại").or(z.literal("")),
    restaurantId: demoValidator.chuoiKhongBatBuoc("Chi nhánh"),
    isManager: z.boolean().optional().default(false),
    permissionIds: demoValidator.array("Danh sách quyền", demoValidator.chuoi("ID Quyền")).optional().default([]),
  }).superRefine((data, ctx) => {
    if (!data.userId) {
      if (!data.name) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tên nhân viên là bắt buộc khi tạo mới", path: ["name"] });
      if (!data.email) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email là bắt buộc khi tạo mới", path: ["email"] });
      if (!data.password) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mật khẩu là bắt buộc khi tạo mới", path: ["password"] });
    }
  }),
});
