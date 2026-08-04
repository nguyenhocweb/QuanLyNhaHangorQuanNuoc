import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const createStaffSchema = z.object({
  userId: z.string().optional().or(z.literal("")),
  name: z.string().optional().or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  phone: validator.phone().optional().or(z.literal("")),
  restaurantId: z.string().optional().or(z.literal("")), // Chi nhánh là tuỳ chọn
  isManager: z.boolean().optional().default(false),
  permissionIds: validator.array("Danh sách quyền", z.string()).optional().default([]),
}).superRefine((data, ctx) => {
  if (!data.userId) {
    if (!data.name) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tên nhân viên là bắt buộc", path: ["name"] });
    if (!data.email) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email là bắt buộc", path: ["email"] });
    if (!data.password) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mật khẩu là bắt buộc", path: ["password"] });
  }
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
