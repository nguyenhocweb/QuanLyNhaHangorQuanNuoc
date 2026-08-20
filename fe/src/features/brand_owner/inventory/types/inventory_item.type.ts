export interface InventoryItem {
  id: string;
  brandId: string;
  sku: string;
  name: string;
  categoryId?: string;
  baseUnit: string;
  minPrice: number;
  maxPrice?: number;
  minStockLevel?: number;
  type?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  supplierId?: string;
  supplier?: {
    id: string;
    name: string;
  };
}
