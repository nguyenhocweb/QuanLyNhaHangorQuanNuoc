import axiosClient from "@/src/core/api/axios-instance";
import { PaginatedCategoryRestaurantType } from "../type/categoryRestaurant";

export const CategoryRestaurantService = async (params: { page: number, limit: number, search: string, status: string }): Promise<PaginatedCategoryRestaurantType> => {
    const res = await axiosClient.get<PaginatedCategoryRestaurantType>("/system-admin/category", { params });
    return res.data;
};