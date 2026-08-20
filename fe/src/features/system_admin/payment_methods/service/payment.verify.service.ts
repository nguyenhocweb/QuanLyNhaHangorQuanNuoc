import axiosClient from "@/src/core/api/axios-instance";

const PAYMENT_CONFIG_URL = "/system-admin/payment-configs";

export interface VerifyResponse {
    status: 'VERIFIED' | 'UNVERIFIED';
    testOrderCode?: string;
    checkoutUrl?: string;
    qrCodeUrl?: string;
    message?: string;
}

export const verifyAdminPaymentConfigService = async (systemPaymentMethodId: string): Promise<VerifyResponse> => {
    const response = await axiosClient.post(`${PAYMENT_CONFIG_URL}/${systemPaymentMethodId}/verify-test`) as any;
    return response.data?.metadata;
};
