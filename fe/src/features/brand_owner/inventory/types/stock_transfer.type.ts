export interface StockTransferItem {
  id: string;
  stockTransferId: string;
  inventoryItemId: string;
  transferQty: number;
  receivedQty: number;
  inventoryItem?: {
    id: string;
    name: string;
    baseUnit: string;
  };
}

export interface StockTransfer {
  id: string;
  fromRestaurantId: string;
  toRestaurantId: string;
  createdBy: string;
  transferNumber: string;
  status: 'DRAFT' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: StockTransferItem[];
}
