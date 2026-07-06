export interface PaymentMethod {
    id: string;
    name: string;
    code: string;
    description: string | null;
    iconUrl: string | null;
    isActive: boolean;
    systemConfig: any | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentMethodFormData {
    name: string;
    code: string;
    description?: string;
    iconUrl?: string;
    isActive: boolean;
    systemConfig?: any;
}
