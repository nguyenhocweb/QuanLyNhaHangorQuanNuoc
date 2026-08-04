import axiosClient from "@/src/core/api/axios-instance";
import { IPublicMenuItemResponse } from "../type/restaurant.public.type";

interface GetPublicMenuItemsParams {
    restaurantId: string;
    page?: number;
    limit?: number;
    search?: string;
    menuId?: string;
    categoryId?: string;
}

export const getPublicMenuItemsService = async (params: GetPublicMenuItemsParams): Promise<{ message: string, metadata: IPublicMenuItemResponse }> => {
    const { restaurantId, ...queryParams } = params;
    const res = await axiosClient.get(`/restaurant/v2/${restaurantId}/menu-items`, { params: queryParams });
    return res.data;
};
