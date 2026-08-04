import axiosClient from "@/src/core/api/axios-instance";
import { IGetEmploymentsResponse } from "../type/staff.type";

interface IGetStaffsParams {
  page?: number;
  limit?: number;
  search?: string;
  restaurantId?: string;
}

export const getStaffsService = async (brandId: string, params: IGetStaffsParams): Promise<IGetEmploymentsResponse> => {
  const { data } = await axiosClient.get(`/brand-owner/${brandId}/employment`, { params });
  return data.metadata;
};
