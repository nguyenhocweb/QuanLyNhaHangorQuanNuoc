import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const webAuthorSchema = z.object({
  fullName: validator.string("Họ và tên", 100, 2),
  roleTitle: validator.string("Chức danh hiển thị", 100, 2),
  role: z.enum([
    "PROJECT_LEAD",
    "FULLSTACK_DEV",
    "FRONTEND_DEV",
    "BACKEND_DEV",
    "UI_UX_DESIGNER",
    "DEVOPS_ENGINEER",
    "QA_QC"
  ]).default("FULLSTACK_DEV"),
  avatarUrl: z.string().optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
  techStackText: z.string().optional().or(z.literal("")), // Nhập dạng "React, Node.js, MongoDB" -> convert mảng
  contributionsText: z.string().optional().or(z.literal("")), // Nhập phân cách bằng dấu xuống dòng
  githubUrl: z.string().url("URL GitHub không hợp lệ").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL LinkedIn không hợp lệ").optional().or(z.literal("")),
  portfolioUrl: z.string().url("URL Portfolio không hợp lệ").optional().or(z.literal("")),
  facebookUrl: z.string().url("URL Facebook không hợp lệ").optional().or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  hasZalo: z.boolean().default(false),
  zaloUrl: z.string().optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  isLeader: z.boolean().default(false)
});

export type WebAuthorFormValues = z.infer<typeof webAuthorSchema>;
