export interface Invoice {
    id: string;
    invoiceNumber: string;
    brandSubscriptionId: string;
    brandId: string;
    issueDate: string;
    dueDate: string;
    subTotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    currency: string;
    status: 'DRAFT' | 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE';
    notes?: string;
    paymentUrl?: string;
    paymentId?: string;
    createdAt: string;
    updatedAt: string;
    brandSubscription?: any;
}

export interface CheckoutResponse {
    invoiceId: string;
    invoiceNumber: string;
    brandSubscriptionId: string;
    checkoutUrl: string;
}
