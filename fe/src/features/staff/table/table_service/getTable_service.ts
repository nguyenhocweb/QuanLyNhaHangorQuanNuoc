import axiosClient from "@/src/core/api/axios-instance";
import { getTableRequest, getAreaAndTableResponse } from "../table_type/getTable_type";
export const getTableService =
    async (
        { idRestaurant, reservation_date, start_time, end_time }
            : getTableRequest
    ): Promise<getAreaAndTableResponse[]> => {

        const params = new URLSearchParams();
        if (reservation_date) params.append("reservation_date", String(reservation_date));
        if (start_time) params.append("start_time", start_time);
        if (end_time) params.append("end_time", end_time);
        const response = await axiosClient.get<getAreaAndTableResponse[]>(`/restaurant/${idRestaurant}/table?${params}`);
        return response.data
    }