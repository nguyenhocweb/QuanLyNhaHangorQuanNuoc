import axiosClient from "@/src/core/api/axios-instance";
import { CategoryRestaurantTypeResponse } from "../type/categoryRestaurant";

export interface UpdateCategoryPayload {
    id: string;
    isActive?: boolean;
    name?: string;
    description?: string;
    bgColor?: string;
    textColor?: string;
}

export const UpdateCategoryRestaurantService = async (data: UpdateCategoryPayload): Promise<CategoryRestaurantTypeResponse> => {
    const { id, ...rest } = data;
    const res = await axiosClient.put<{ data: CategoryRestaurantTypeResponse }>(`/system-admin/category/${id}`, rest);
    return res.data.data;
};
