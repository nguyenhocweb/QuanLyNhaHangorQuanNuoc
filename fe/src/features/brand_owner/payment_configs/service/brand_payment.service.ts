import axiosClient from "@/src/core/api/axios-instance";
import { BrandPaymentConfigsResponse, BrandPaymentConfigData } from "../type/brand_payment.type";

export const getBrandPaymentConfigsService = async (brandId: string): Promise<{ message: string; metadata: BrandPaymentConfigsResponse }> => {
    return (await axiosClient.get(`/brand-owner/${brandId}/payment-configs`)) as any;
};

export const upsertBrandPaymentConfigService = async (
    brandId: string,
    systemPaymentMethodId: string,
    payload: {
        isActive?: boolean;
        isTestMode?: boolean;
        configData: Record<string, any>;
    }
): Promise<{ message: string; metadata: BrandPaymentConfigData }> => {
    return (await axiosClient.post(`/brand-owner/${brandId}/payment-configs/${systemPaymentMethodId}`, payload)) as any;
};

export const createBrandPaymentMethodService = async (
    brandId: string,
    payload: {
        name: string;
        code: string;
        description?: string;
        iconUrl?: string;
        isActive?: boolean;
    }
): Promise<{ message: string; metadata: any }> => {
    return (await axiosClient.post(`/brand-owner/${brandId}/payment-configs`, payload)) as any;
};
