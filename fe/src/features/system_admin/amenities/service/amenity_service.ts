import axiosClient from "@/src/core/api/axios-instance";
import { IAmenity } from "../type/amenity.type";

const BASE_URL = "/system-admin/amenity";

export const getAmenitiesService = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await axiosClient.get(BASE_URL, { params });
  return response.data;
};

export const createAmenityService = async (data: any) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

export const updateAmenityService = async ({ id, ...data }: { id: string } & any) => {
  const response = await axiosClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteAmenityService = async (id: string) => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};
