export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  note?: string;
  status: 'QUEUED' | 'PREPARING' | 'READY' | 'SERVING' | 'SERVED' | 'CANCELLED';
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId?: string;
  takenByEmpId?: string;
  order_number: string;
  isTakeaway: boolean;
  status: 'OPEN' | 'SENT_TO_KITCHEN' | 'PARTIALLY_SERVED' | 'SERVED' | 'BILL_REQUESTED' | 'PAID' | 'CANCELLED';
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  systemPaymentMethodId?: string;
  paid_at?: string;
  createdAt: string;
  
  table?: { id: string; table_number: string };
  takenByEmp?: { id: string; name: string };
  items?: OrderItem[];
}

export interface OrderListResponse {
  message: string;
  metadata: {
    data: Order[];
    meta: {
      totalRecords: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    };
  };
}
