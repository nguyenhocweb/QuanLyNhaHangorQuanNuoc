import axiosClient from "@/src/core/api/axios-instance";
import { UpsertOperatingHoursFormValues } from "../schema/operating_hours.upsert.schema";
import { IOperatingHour } from "../type/operating_hours.type";

export const upsertOperatingHoursService = async (id_brand: string, idRestaurant: string, data: UpsertOperatingHoursFormValues): Promise<{ metadata: IOperatingHour[] }> => {
    return axiosClient.put(`/brand-owner/${id_brand}/operating-hours/${idRestaurant}`, data);
};
