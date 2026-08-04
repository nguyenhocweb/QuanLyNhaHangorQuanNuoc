import axiosClient from "@/src/core/api/axios-instance";

const RESTAURANT_API = "/brand-owner";

export const updateRestaurantMenu = async ({
    id_brand,
    restaurantId,
    menuItemId,
    data
}: {
    id_brand: string;
    restaurantId: string;
    menuItemId: string;
    data: { isAvailable?: boolean; overridePrice?: number | null };
}) => {
    const response = await axiosClient.put(`${RESTAURANT_API}/${id_brand}/restaurant/${restaurantId}/menu/${menuItemId}`, data);
    return response.data;
};

export const deleteRestaurantMenu = async ({
    id_brand,
    restaurantId,
    menuItemId
}: {
    id_brand: string;
    restaurantId: string;
    menuItemId: string;
}) => {
    const response = await axiosClient.delete(`${RESTAURANT_API}/${id_brand}/restaurant/${restaurantId}/menu/${menuItemId}`);
    return response.data;
};
