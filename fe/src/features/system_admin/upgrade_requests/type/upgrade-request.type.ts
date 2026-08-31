export interface UpgradeRequestUser {
  id: string;
  name: string;
  email: string;
  sdt: string;
  avatar?: string;
}

export interface AdminUpgradeRequest {
  id: string;
  userId: string;
  brandName: string;
  logo?: string;
  description?: string;
  representativeName?: string;
  phone_contact?: string;
  email_contact?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    province?: string;
  };
  tax_code?: string;
  taxCode?: string;
  businessLicense?: string;
  identityCard?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
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
