import axiosClient from "@/src/core/api/axios-instance";
import { GetReservationsResponse } from "../type/reservation.type";

export const getMyReservationsService = async (params: { page: number; limit: number; status?: string }): Promise<{ message: string, metadata: GetReservationsResponse }> => {
    const res = await axiosClient.get("/customer/reservation", { params });
    return res.data;
};
