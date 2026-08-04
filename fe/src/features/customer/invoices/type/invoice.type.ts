export interface PaymentMethodType {
    id: string;
    name: string;
    code: string;
    iconUrl: string | null;
}

export interface TransactionType {
    id: string;
    orderId: string;
    amount: number;
    externalTransactionId: string | null;
    status: string;
    createdAt: string;
    systemPaymentMethod: PaymentMethodType;
}

export interface InvoiceItemType {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface CustomerInvoiceType {
    id: string;
    order_number: string;
    total_amount: number;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    paid_at: string;
    status: string;
    restaurant?: {
        id: string;
        name: string;
        logo: string;
        address: string;
    };
    transactions: TransactionType[];
    items: InvoiceItemType[];
}

export interface GetMyInvoicesResponse {
    data: CustomerInvoiceType[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
