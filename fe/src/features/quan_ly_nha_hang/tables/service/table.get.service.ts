import axiosClient from "@/src/core/api/axios-instance";
import { GetAreasWithTablesResponse } from "../type/table.type";

export const getAreasWithTablesService = async (restaurantId: string): Promise<GetAreasWithTablesResponse> => {
    const response = await axiosClient.get(`/restaurant-manager/table/${restaurantId}/areas-with-tables`);
    return response.data;
};
