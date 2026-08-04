export interface IPermission {
  id: string;
  name: string;
  description: string;
}

export interface IStaff {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  sdt: string | null;
  roleName: string;
  salary_type: "HOURLY" | "MONTHLY" | null;
  restaurantId: string | null;
  restaurantName: string | null;
  createdAt: string;
  permissions: IPermission[];
}

export interface IGetStaffsResponse {
  message: string;
  metadata: {
    items: IStaff[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ICreateStaffPayload {
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  restaurantId: string;
  roleName?: string;
  salary_type?: "HOURLY" | "MONTHLY" | null;
  permissionIds?: string[];
}

export interface IUpdateStaffPayload {
  restaurantId?: string;
  roleName?: string;
  salary_type?: "HOURLY" | "MONTHLY" | null;
  permissionIds?: string[];
}
