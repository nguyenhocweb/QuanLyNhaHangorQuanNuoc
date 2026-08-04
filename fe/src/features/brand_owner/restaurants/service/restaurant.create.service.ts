import axiosClient from "@/src/core/api/axios-instance";

export const createRestaurantService = async (data: { id_brand: string; payload: any }) => {
    return await axiosClient.post(`/brand-owner/${data.id_brand}/restaurant`, data.payload);
};
