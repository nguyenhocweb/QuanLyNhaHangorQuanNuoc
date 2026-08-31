import axiosClient from "@/src/core/api/axios-instance";
import { GetReservationsResponse, Reservation } from "../type/reservation.type";

export const getReservationsService = async (
    restaurantId: string, 
    params?: { tab?: string; date?: string; status?: string; search?: string; page?: number; limit?: number }
): Promise<{ message: string; metadata: GetReservationsResponse }> => {
    const response = await axiosClient.get(`/restaurant-manager/reservation/${restaurantId}`, { params });
    return response.data;
};

export const getReservationByIdService = async (
    restaurantId: string, 
    id: string
): Promise<{ message: string; metadata: Reservation }> => {
    const response = await axiosClient.get(`/restaurant-manager/reservation/${restaurantId}/${id}`);
    return response.data;
};
