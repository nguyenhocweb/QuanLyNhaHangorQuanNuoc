import axiosClient from "@/src/core/api/axios-instance";
import { IOperatingHour } from "../type/operating_hours.type";

export const getOperatingHoursService = async (id_brand: string, idRestaurant: string): Promise<{ metadata: IOperatingHour[] }> => {
    return axiosClient.get(`/brand-owner/${id_brand}/operating-hours/${idRestaurant}`);
};
