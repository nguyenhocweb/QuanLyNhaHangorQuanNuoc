import axiosClient from "@/src/core/api/axios-instance";
import { IGetStaffsResponse } from "../type/staff.type";

export interface IGetStaffsParams {
  restaurantId?: string;
  page?: number;
  limit?: number;
  search?: string;
  salary_type?: string;
}

export const getStaffsService = async (params: IGetStaffsParams): Promise<IGetStaffsResponse> => {
  const { restaurantId, ...restParams } = params;
  if (!restaurantId) throw new Error("restaurantId is required");
  const res = await axiosClient.get(`/restaurant-manager/${restaurantId}/staff`, { params: restParams });
  return res.data;
};
