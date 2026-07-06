export type RoleType = "ADMIN" | "BRAND_OWNER" | "STAFF";
export type StatusType = "ACTIVE" | "PENDING" | "BANNED";

export interface Employment {
  brand?: { name: string };
  restaurant?: { name: string };
}

export interface User {
  id: string | number;
  name: string;
  avatar: string;
  isOnline: boolean;
  email: string;
  phone: string;
  role: RoleType;
  status: StatusType;
  createdAt: string;
  employments?: Employment[];
}

export interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface DashboardStats {
  totalUsers: number;
  newUsers30Days: number;
  lockedUsers: number;
}

// Kiểu dữ liệu tổng quát BE trả về
export interface FetchUsersResponse {
  data: User[];
  meta: PaginationMeta;
  stats: DashboardStats;
}

// Kiểu params truyền lên BE
export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
  dateFilter?: string;
}

export interface CreateUserPayload {
  name: string;
  user_name: string;
  email: string;
  phone?: string;
  password?: string;
  roleId: string;
  status: string;
}

export interface CreateUserResponse {
  message: string;
  data: User;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  status?: string;
}

export interface UpdateUserResponse {
  message: string;
  data: User;
}