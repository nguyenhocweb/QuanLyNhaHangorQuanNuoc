export type DeveloperRole =
  | "PROJECT_LEAD"
  | "FULLSTACK_DEV"
  | "FRONTEND_DEV"
  | "BACKEND_DEV"
  | "UI_UX_DESIGNER"
  | "DEVOPS_ENGINEER"
  | "QA_QC";

export interface IAdminWebAuthor {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role: DeveloperRole;
  roleTitle: string;
  techStack: string[];
  contributions: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  phone?: string | null;
  hasZalo?: boolean;
  zaloUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  isLeader: boolean;
  createdAt: string;
  updatedAt: string;
}
