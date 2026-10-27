import { z } from "zod";

export const updateWebAuthorValidator = z.object({
  params: z.object({
    id: z.string().min(1, "ID không hợp lệ")
  }),
  body: z.object({
    fullName: z.string().min(1, "Họ và tên không được để trống").optional(),
    roleTitle: z.string().min(1, "Chức danh hiển thị không được để trống").optional(),
    role: z.enum(["PROJECT_LEAD", "FULLSTACK_DEV", "FRONTEND_DEV", "BACKEND_DEV", "UI_UX_DESIGNER", "DEVOPS_ENGINEER", "QA_QC"]).optional(),
    avatarUrl: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    techStack: z.array(z.string()).optional(),
    contributions: z.array(z.string()).optional(),
    githubUrl: z.string().nullable().optional(),
    linkedinUrl: z.string().nullable().optional(),
    portfolioUrl: z.string().nullable().optional(),
    facebookUrl: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    hasZalo: z.boolean().optional(),
    zaloUrl: z.string().nullable().optional(),
    displayOrder: z.number().optional(),
    isActive: z.boolean().optional(),
    isLeader: z.boolean().optional()
  })
});
