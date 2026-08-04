import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "@/src/features/system_admin/brands/brands_type/brand-type";

export const getMyBrandSubscriptionService = async () => {
    // Brand["subscriptions"] is an array, but our API returns a single subscription object or null
    return await axiosClient.get<{ message: string; data: Brand["subscriptions"] extends (infer U)[] | undefined ? U : any }>("/brand-owner/brand/subscription");
};
