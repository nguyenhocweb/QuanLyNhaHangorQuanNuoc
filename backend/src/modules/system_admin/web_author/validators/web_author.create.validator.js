import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const createWebAuthorValidator = z.object({
  body: z.object({
    fullName: demoValidator.chuoi("Họ và tên"),
    roleTitle: demoValidator.chuoi("Chức danh hiển thị"),
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
