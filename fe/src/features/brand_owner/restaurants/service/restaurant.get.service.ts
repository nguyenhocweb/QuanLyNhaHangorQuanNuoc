import axiosClient from "@/src/core/api/axios-instance";
import { RestaurantTypeResponse } from "../type/restaurant.type";

export const getRestaurantsService = async (id_brand: string) => {
    return await axiosClient.get<RestaurantTypeResponse[]>(`/brand-owner/${id_brand}/restaurant`);
};
