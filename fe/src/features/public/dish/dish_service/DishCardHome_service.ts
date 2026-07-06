import axiosClient from "@/src/core/api/axios-instance";
import { DishCardResponseType,DishCardRequestType } from "../dish_type/card_dish_type";
export const DishCardHomeSevice=async ({id,type,limit,page,search}:DishCardRequestType):Promise<DishCardResponseType>=>{
    const params = new URLSearchParams();
    params.append("type", type);
    params.append("limit", String(limit));
    params.append("page", String(page));
    if (search) {
        params.append("search", search);
    }
    const endpoint = id ? `/dish/${id}` : '/dish';
    const response=await axiosClient.get<DishCardResponseType>(`${endpoint}?${params.toString()}`)   ;     
    return response.data;
}