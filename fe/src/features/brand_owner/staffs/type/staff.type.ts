export interface IPermission {
  id: string;
  name: string;
  description: string;
}

export interface IEmployment {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  sdt: string | null;
  salary_type: "HOURLY" | "MONTHLY" | null;
  restaurantId: string | null;
  restaurantName: string | null;
  createdAt: string;
  roleName?: string;
  permissions: IPermission[];
}

export interface IGetEmploymentsResponse {
  items: IEmployment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
