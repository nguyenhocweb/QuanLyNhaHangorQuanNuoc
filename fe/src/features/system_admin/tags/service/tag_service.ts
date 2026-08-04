import axiosClient from "@/src/core/api/axios-instance";
import { ITag } from "../type/tag.type";

const BASE_URL = "/system-admin/tag";

export const getTagsService = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await axiosClient.get(BASE_URL, { params });
  return response.data;
};

export const createTagService = async (data: any) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

export const updateTagService = async ({ id, ...data }: { id: string } & any) => {
  const response = await axiosClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteTagService = async (id: string) => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};
