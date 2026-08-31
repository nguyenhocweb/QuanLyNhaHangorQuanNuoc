export interface SystemPaymentMethod {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    iconUrl?: string | null;
    isActive: boolean;
}

export interface BrandPaymentConfigData {
    id?: string;
    brandId: string;
    systemPaymentMethodId: string;
    configData: Record<string, any>;
    isActive: boolean;
    isTestMode: boolean;
    updatedAt?: string;
}

export interface PaymentMethodCombined {
    method: SystemPaymentMethod;
    config: BrandPaymentConfigData | null;
}

export interface BrandPaymentConfigsResponse {
    brand: {
        id: string;
        name: string;
        logo?: string | null;
    };
    paymentMethods: PaymentMethodCombined[];
}

export interface BankTransferConfigValues {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrTemplate?: string;
}
