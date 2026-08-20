import axiosClient from "@/src/core/api/axios-instance";

export const getStockCountsService = async (brandId: string, restaurantId?: string, page: number = 1, limit: number = 10) => {
  const url = restaurantId 
    ? `/brand-owner/${brandId}/stock-count?restaurantId=${restaurantId}&page=${page}&limit=${limit}`
    : `/brand-owner/${brandId}/stock-count?page=${page}&limit=${limit}`;
  const response = await axiosClient.get(url);
  return response.data;
};

export const getStockCountByIdService = async (brandId: string, id: string) => {
  const response = await axiosClient.get(`/brand-owner/${brandId}/stock-count/${id}`);
  return response.data;
};

export const createStockCountService = async (brandId: string, data: any) => {
  const response = await axiosClient.post(`/brand-owner/${brandId}/stock-count`, data);
  return response.data;
};

export const updateStockCountService = async (brandId: string, id: string, data: any) => {
  const response = await axiosClient.put(`/brand-owner/${brandId}/stock-count/${id}`, data);
  return response.data;
};

export const deleteStockCountService = async (brandId: string, id: string) => {
  const response = await axiosClient.delete(`/brand-owner/${brandId}/stock-count/${id}`);
  return response.data;
};

export const approveStockCountService = async (brandId: string, id: string, reason: string) => {
  const response = await axiosClient.patch(`/brand-owner/${brandId}/stock-count/${id}/approve`, { reason });
  return response.data;
};

export const rejectStockCountService = async (brandId: string, id: string, reason: string) => {
  const response = await axiosClient.patch(`/brand-owner/${brandId}/stock-count/${id}/reject`, { reason });
  return response.data;
};
