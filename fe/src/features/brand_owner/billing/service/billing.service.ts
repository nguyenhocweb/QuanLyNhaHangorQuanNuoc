import axiosClient from "@/src/core/api/axios-instance";
import { Invoice, CheckoutResponse } from "../type/billing.type";
import { SubscriptionPlan } from "@/src/features/system_admin/subscriptions/type/subscription.type";

export const getInvoicesService = async (brandId: string): Promise<{ data: Invoice[] }> => {
    return axiosClient.get(`/brand-owner/${brandId}/invoice`);
};

export const getSubscriptionPlansService = async (brandId: string): Promise<{ data: SubscriptionPlan[] }> => {
    return axiosClient.get(`/brand-owner/${brandId}/subscription/plans`);
};

export const checkoutSubscriptionService = async (brandId: string, planId: string): Promise<{ data: CheckoutResponse }> => {
    return axiosClient.post(`/brand-owner/${brandId}/subscription/checkout`, { planId });
};
