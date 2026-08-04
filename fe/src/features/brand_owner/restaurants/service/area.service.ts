import axiosClient from "@/src/core/api/axios-instance";

export const getAreasByRestaurantIdService = async (restaurantId: string) => {
    return await axiosClient.get(`/brand-owner/area/restaurant/${restaurantId}`);
};

export const createAreaService = async (payload: any) => {
    return await axiosClient.post(`/brand-owner/area`, payload);
};

export const updateAreaService = async (data: { id: string; payload: any }) => {
    return await axiosClient.put(`/brand-owner/area/${data.id}`, data.payload);
};

export const deleteAreaService = async (id: string) => {
    return await axiosClient.delete(`/brand-owner/area/${id}`);
};
