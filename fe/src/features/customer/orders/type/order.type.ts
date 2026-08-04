export interface OrderItemType {
    id: string;
    name: string;
    quantity: number;
    totalPrice: number;
}

export interface CustomerOrderType {
    id: string;
    order_number: string;
    status: 'OPEN' | 'SENT_TO_KITCHEN' | 'PARTIALLY_SERVED' | 'SERVED' | 'BILL_REQUESTED' | 'PAID' | 'CANCELLED';
    total_amount: number;
    createdAt: string;
    paid_at?: string;
    _count?: {
        items: number;
    };
    items?: OrderItemType[];
    restaurant?: {
        id: string;
        name: string;
        logo: string;
    };
}

export interface GetMyOrdersResponse {
    data: CustomerOrderType[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
