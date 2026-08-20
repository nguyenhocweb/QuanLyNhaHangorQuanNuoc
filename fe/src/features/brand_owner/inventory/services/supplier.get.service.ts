import axiosClient from "@/src/core/api/axios-instance";
import { Supplier } from "../types/supplier.type";

export const getSuppliersService = async (
  brandId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<{ message: string, metadata: Supplier[], options: { totalCount: number, totalPages: number, page: number, limit: number } }> => {
  return await axiosClient.get(`/brand-owner/${brandId}/supplier`, { params: { page, limit } });
};

