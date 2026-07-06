export interface SystemPaymentMethod {
    id: string;
    name: string;
    code: string;
    description: string | null;
    iconUrl: string | null;
}

export interface BrandSubscriptionTransaction {
    id: string;
    brandSubscriptionId: string;
    amount: number;
    externalTransactionId: string | null;
    status: string;
    rawResponse: any | null;
    createdAt: string;
    updatedAt: string;
    systemPaymentMethodId: string;
    systemPaymentMethod: SystemPaymentMethod;
}

export interface TransactionResponse {
    message: string;
    data: BrandSubscriptionTransaction;
}
