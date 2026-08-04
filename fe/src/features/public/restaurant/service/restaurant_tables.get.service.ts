import axiosClient from "@/src/core/api/axios-instance";

export const getAvailableTablesService = async (
    idRestaurant: string, 
    params: { date: string, startTime: string, endTime: string, partySize: number }
) => {
    const response = await axiosClient.get(`/restaurant/v2/${idRestaurant}/tables/available`, { params });
    return response.data.metadata;
};
