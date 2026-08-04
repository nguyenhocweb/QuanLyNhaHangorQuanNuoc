import axiosClient from "@/src/core/api/axios-instance";
import { Reservation } from "../type/reservation.type";
import { ReservationFormValues } from "../schema/reservation.schema";

export const createReservationService = async (
    restaurantId: string, 
    data: ReservationFormValues
): Promise<{ message: string; metadata: Reservation }> => {
    const response = await axiosClient.post(`/restaurant-manager/reservation/${restaurantId}`, data);
    return response.data;
};
