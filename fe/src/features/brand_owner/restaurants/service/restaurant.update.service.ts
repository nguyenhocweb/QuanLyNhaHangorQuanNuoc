import axiosClient from "@/src/core/api/axios-instance";

export const updateRestaurantService = async (data: { id_brand: string; id: string; payload: any }) => {
    return await axiosClient.put(`/brand-owner/${data.id_brand}/restaurant/${data.id}`, data.payload);
};
