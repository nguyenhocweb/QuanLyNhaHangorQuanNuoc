import axiosClient from "@/src/core/api/axios-instance";
import { Brand } from "@/src/features/system_admin/brands/brands_type/brand-type";

export const getMyBrandRestaurantsService = async () => {
    return await axiosClient.get<{ message: string; data: Brand["restaurants"] }>("/brand-owner/brand/restaurants");
};
