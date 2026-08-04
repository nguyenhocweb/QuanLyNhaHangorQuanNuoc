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
  const res = await axiosClient.get("/restaurant-manager/staff", { params });
  return res.data;
};
