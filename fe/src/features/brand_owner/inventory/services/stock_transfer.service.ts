import axiosClient from "@/src/core/api/axios-instance";

export const getStockTransfersService = async (brandId: string, page: number = 1, limit: number = 10) => {
  const response = await axiosClient.get(`/brand-owner/${brandId}/stock-transfer?page=${page}&limit=${limit}`);
  return response.data;
};

export const getStockTransferByIdService = async (brandId: string, id: string) => {
  const response = await axiosClient.get(`/brand-owner/${brandId}/stock-transfer/${id}`);
  return response.data;
};

export const createStockTransferService = async (brandId: string, data: any) => {
  const response = await axiosClient.post(`/brand-owner/${brandId}/stock-transfer`, data);
  return response.data;
};

export const updateStockTransferService = async (brandId: string, id: string, data: any) => {
  const response = await axiosClient.put(`/brand-owner/${brandId}/stock-transfer/${id}`, data);
  return response.data;
};

export const deleteStockTransferService = async (brandId: string, id: string) => {
  const response = await axiosClient.delete(`/brand-owner/${brandId}/stock-transfer/${id}`);
  return response.data;
};
