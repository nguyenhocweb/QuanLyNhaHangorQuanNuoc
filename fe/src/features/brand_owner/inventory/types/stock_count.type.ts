export interface StockCountItem {
  id: string;
  stockCountId: string;
  inventoryItemId: string;
  inventoryItem?: any;
  systemQty: number;
  actualQty: number;
  discrepancy: number;
}

export interface StockCount {
  id: string;
  restaurantId: string;
  brandId: string;
  createdBy: string;
  code: string;
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: StockCountItem[];
  restaurant?: any;
}
