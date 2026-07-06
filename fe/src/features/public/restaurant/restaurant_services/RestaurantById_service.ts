import axiosClient from "@/src/core/api/axios-instance";
import {RestaurantDetailResponse} from "@/src/features/public/restaurant/restaurant_type/restaurantById_type";
export const RestaurantByIdService=async(id:string):Promise<RestaurantDetailResponse>=>{
    const response=await axiosClient.get<RestaurantDetailResponse>(`/restaurant/${id}`);
    return response.data
}