import axiosClient from "@/src/core/api/axios-instance";
import { ReservationForm } from "../reservation_schemas/createReservation_schemas";
export const createReservation_service=async (data:ReservationForm)=>{
    const response=await axiosClient.post("/restaurant/reservation",data)   ;     
    return response.data;
}