import axiosClient from "@/src/core/api/axios-instance";

export const getRestaurantUtilitiesService = async (id_brand: string, id: string) => {
    return await axiosClient.get(`/brand-owner/${id_brand}/restaurant/${id}/utilities`);
};
