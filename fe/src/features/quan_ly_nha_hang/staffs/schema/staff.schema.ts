import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const createStaffSchema = z.object({
  userId: z.string().optional(),
  name: validator.string("Tên nhân viên").optional(),
  email: validator.email().optional().or(z.literal("")),
  password: validator.password("Mật khẩu").optional().or(z.literal("")),
  phone: validator.phone().optional().or(z.literal("")),
  roleName: validator.string("Vai trò").default("Nhân viên"),
  salary_type: z.enum(["HOURLY", "MONTHLY"]).nullable().default(null),
  permissionIds: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  if (!data.userId) {
    if (!data.name) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tên nhân viên là bắt buộc khi tạo mới", path: ["name"] });
    if (!data.email) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email là bắt buộc khi tạo mới", path: ["email"] });
    if (!data.password) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mật khẩu là bắt buộc khi tạo mới", path: ["password"] });
  }
});

export type CreateStaffValues = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z.object({
  roleName: validator.string("Vai trò").default("Nhân viên"),
  salary_type: z.enum(["HOURLY", "MONTHLY"]).nullable().default(null),
  permissionIds: z.array(z.string()).default([]),
});

export type UpdateStaffValues = z.infer<typeof updateStaffSchema>;
