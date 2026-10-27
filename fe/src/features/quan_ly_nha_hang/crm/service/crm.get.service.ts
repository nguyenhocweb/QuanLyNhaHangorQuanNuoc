import axiosClient from "@/src/core/api/axios-instance";
import { CrmAnalyticsData } from "../type/crm.type";

export const getRestaurantCrmAnalyticsService = async (restaurantId: string): Promise<CrmAnalyticsData> => {
  const response = await axiosClient.get(`/restaurant-manager/crm/analytics`, {
    params: { restaurantId }
  });
  return response.data.metadata;
};

export const getBrandCrmAnalyticsService = async (brandId: string): Promise<CrmAnalyticsData> => {
  const response = await axiosClient.get(`/brand-owner/${brandId}/crm/analytics`);
  return response.data.metadata;
};

export const getBrandLoyaltyTransactionsService = async (brandId: string): Promise<any[]> => {
  const response = await axiosClient.get(`/brand-owner/${brandId}/crm/transactions`);
  return response.data.metadata;
};
