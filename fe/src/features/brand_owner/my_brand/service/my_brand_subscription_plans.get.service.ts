import axiosClient from "@/src/core/api/axios-instance";

export interface SubscriptionPlan {
    id: string;
    name: string;
    description?: string;
    price: number;
    billingCycle: string;
    maxRestaurants: number;
    maxAccounts: number;
    maxMenuItems: number;
    supportLevel: string;
    isFeatured: boolean;
    isActive: boolean;
}

export const getSubscriptionPlansService = async () => {
    const { data } = await axiosClient.get<{ message: string; data: SubscriptionPlan[] }>('/brand-owner/brand/subscription/plans');
    return data.data;
};
