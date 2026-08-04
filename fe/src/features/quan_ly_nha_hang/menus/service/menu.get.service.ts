import axiosClient from "@/src/core/api/axios-instance";
import { GetRestaurantMenuParams, GetRestaurantMenuResponse } from "../type/menu.type";

export const getRestaurantMenuService = async (
    restaurantId: string,
    params?: GetRestaurantMenuParams
): Promise<GetRestaurantMenuResponse> => {
    const response = await axiosClient.get<GetRestaurantMenuResponse>(
        `/restaurant-manager/menu`,
        {
            params: {
                restaurantId,
                ...params
            }
        }
    );
    return response.data;
};
