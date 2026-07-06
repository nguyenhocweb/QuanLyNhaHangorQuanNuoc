import axiosClient from "@/src/core/api/axios-instance";
import { PaginatedRestaurantType, CreateRestaurantProps, UpdateRestaurantProps } from "../type/restaurant";

export const getRestaurantService = async (params: { page: number, limit: number, search: string, status: string, city?: string, rating?: string, categoryId?: string }): Promise<PaginatedRestaurantType> => {
    const res = await axiosClient.get<PaginatedRestaurantType>("/system-admin/restaurant", { params });
    return res.data;
};

export const getRestaurantByIdService = async (id: string): Promise<any> => {
    const res = await axiosClient.get(`/system-admin/restaurant/${id}`);
    return res.data;
};

export const createRestaurantService = async (data: CreateRestaurantProps): Promise<any> => {
    const res = await axiosClient.post("/system-admin/restaurant", data);
    return res.data;
};

export const updateRestaurantService = async (data: UpdateRestaurantProps): Promise<any> => {
    const { id, ...payload } = data;
    const res = await axiosClient.put(`/system-admin/restaurant/${id}`, payload);
    return res.data;
};

export const deleteRestaurantService = async (id: string): Promise<any> => {
    const res = await axiosClient.delete(`/system-admin/restaurant/${id}`);
    return res.data;
};
