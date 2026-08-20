import axiosClient from "@/src/core/api/axios-instance";
import { SystemPaymentMethod, AdminPaymentConfig } from "../type/payment.type";
import { MethodMetadataFormValues, ApiConfigFormValues } from "../schema/payment.schema";

const PAYMENT_METHOD_URL = "/system-admin/payment-method";
const PAYMENT_CONFIG_URL = "/system-admin/payment-configs";

// System Payment Methods Services
export const getPaymentMethodsService = async (): Promise<SystemPaymentMethod[]> => {
    const response = await axiosClient.get(PAYMENT_METHOD_URL) as any;
    return response.data?.data || [];
};

export const createPaymentMethodService = async (data: MethodMetadataFormValues): Promise<SystemPaymentMethod> => {
    const response = await axiosClient.post(PAYMENT_METHOD_URL, data) as any;
    return response.data?.data;
};

export const updatePaymentMethodService = async (id: string, data: Partial<MethodMetadataFormValues>): Promise<SystemPaymentMethod> => {
    const response = await axiosClient.put(`${PAYMENT_METHOD_URL}/${id}`, data) as any;
    return response.data?.data;
};

export const deletePaymentMethodService = async (id: string): Promise<void> => {
    await axiosClient.delete(`${PAYMENT_METHOD_URL}/${id}`);
};

// Admin Payment Configs Services
export const getAdminPaymentConfigService = async (systemPaymentMethodId: string): Promise<AdminPaymentConfig | null> => {
    try {
        const response = await axiosClient.get(`${PAYMENT_CONFIG_URL}/${systemPaymentMethodId}`) as any;
        return response.data?.metadata;
    } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
    }
};

export const upsertAdminPaymentConfigService = async (systemPaymentMethodId: string, data: ApiConfigFormValues): Promise<AdminPaymentConfig> => {
    const payload = {
        configData: data.configData,
        isActive: data.isActive,
        isTestMode: data.isTestMode
    };
    const response = await axiosClient.post(`${PAYMENT_CONFIG_URL}/${systemPaymentMethodId}`, payload) as any;
    return response.data?.metadata;
};
