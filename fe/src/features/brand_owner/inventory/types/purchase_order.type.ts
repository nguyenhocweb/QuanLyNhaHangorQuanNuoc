export interface PurchaseOrderItem {
  id?: string;
  inventoryItemId: string;
  orderQty: number;
  receivedQty?: number;
  unitPrice: number;
  inventoryItem?: {
    name: string;
    sku: string;
    baseUnit: string;
  };
}

export interface PurchaseOrder {
  id: string;
  restaurantId: string;
  supplierId: string;
  createdBy: string;
  poNumber: string;
  status: "DRAFT" | "PENDING" | "PARTIAL" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  items: PurchaseOrderItem[];
  supplier?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
