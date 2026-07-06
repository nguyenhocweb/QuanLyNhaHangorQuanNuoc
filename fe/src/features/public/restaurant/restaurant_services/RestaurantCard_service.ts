import { RestaurantCardResponseType } from "../restaurant_type/restaurant_card_type";
import axiosClient from "@/src/core/api/axios-instance";
import { RestaurantCardRequestType } from "../restaurant_type/restaurant_card_type";
export const RestaurantCardService=async({page,limit,city,search,id,categoryRestaurant,review}:RestaurantCardRequestType):Promise<RestaurantCardResponseType>=>{
   const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (search) params.append("search", search);
    if (city) params.append("city", city);
    if(id) params.append("idBrand",id);
    if(categoryRestaurant) params.append("category", categoryRestaurant.join(","));
    if(review !== undefined) params.append("review", String(review));
       const response=await axiosClient.get<RestaurantCardResponseType>(`restaurant?${params.toString()}`);
       return response.data
    }