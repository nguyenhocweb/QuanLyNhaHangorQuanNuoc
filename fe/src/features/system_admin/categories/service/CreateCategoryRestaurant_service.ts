import axiosClient from "@/src/core/api/axios-instance";
import { CreateCategoryFormValues } from "../schema/createCategory-schema";
import { CategoryRestaurantTypeResponse } from "../type/categoryRestaurant";

export const CreateCategoryRestaurantService = async (data: CreateCategoryFormValues): Promise<CategoryRestaurantTypeResponse> => {
    const res = await axiosClient.post<{ data: CategoryRestaurantTypeResponse }>("/system-admin/category", data);
    return res.data.data;
};
