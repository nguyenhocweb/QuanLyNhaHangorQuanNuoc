export interface Supplier {
  id: string;
  brandId: string;
  name: string;
  taxCode?: string;
  contact?: {
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  status: string;
  createdAt: string;
}
