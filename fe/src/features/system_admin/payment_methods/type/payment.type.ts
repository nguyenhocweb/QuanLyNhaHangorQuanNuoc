export interface SystemPaymentMethod {
    id: string;
    name: string;
    code: string;
    description: string | null;
    iconUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type PaymentProviderCode = 'VNPAY' | 'MOMO' | 'PAYOS' | 'CASH' | 'BANK_TRANSFER' | 'SEPAY' | string;

export interface AdminPaymentConfig {
    id: string;
    systemPaymentMethodId: string;
    configData: any;
    isActive: boolean;
    isTestMode: boolean;
    verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'FAILED';
    lastVerifiedAt: string | null;
    lastTestOrderCode: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentMethodCombined {
    method: SystemPaymentMethod;
    config: AdminPaymentConfig | null;
}
