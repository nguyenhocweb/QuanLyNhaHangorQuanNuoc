export interface UpgradeRequestUser {
  id: string;
  name: string;
  email: string;
  sdt: string;
}

export interface AdminUpgradeRequest {
  id: string;
  userId: string;
  brandName: string;
  tax_code: string;
  businessLicense: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: UpgradeRequestUser;
}

export interface UpgradeRequestsResponse {
  data: AdminUpgradeRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
