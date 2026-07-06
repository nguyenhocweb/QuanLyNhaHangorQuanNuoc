import axiosClient from "@/src/core/api/axios-instance";
import { SubscriptionPlan } from "../type/subscription.type";
import { SubscriptionFormValues } from "../schema/subscription-schema";

export const getSubscriptionFeaturesService = async (): Promise<any> => {
    const res = await axiosClient.get("/system-admin/subscription/features");
    return res.data;
};

export const getSubscriptionService = async (params?: { page?: number, limit?: number, search?: string, status?: string }): Promise<any> => {
    const res = await axiosClient.get("/system-admin/subscription", { params });
    return res.data;
};

export const createSubscriptionService = async (data: SubscriptionFormValues): Promise<any> => {
    const res = await axiosClient.post("/system-admin/subscription", data);
    return res.data;
};

export const updateSubscriptionService = async (data: SubscriptionFormValues & { id: string }): Promise<any> => {
    const { id, ...payload } = data;
    const res = await axiosClient.put(`/system-admin/subscription/${id}`, payload);
    return res.data;
};

export const deleteSubscriptionService = async (id: string): Promise<any> => {
    const res = await axiosClient.delete(`/system-admin/subscription/${id}`);
    return res.data;
};
