import axiosClient from "@/src/core/api/axios-instance";
import { RestaurantTypeResponse } from "../type/restaurant.type";

export const getRestaurantByIdService = async (id_brand: string, id: string) => {
    return await axiosClient.get<RestaurantTypeResponse>(`/brand-owner/${id_brand}/restaurant/${id}`);
};
