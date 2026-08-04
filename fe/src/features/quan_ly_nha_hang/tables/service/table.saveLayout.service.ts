import axiosClient from "@/src/core/api/axios-instance";

export const saveTableLayoutService = async (payload: { area_id: string, tables: any[], obstacles: any[], background_url?: string, width?: number, height?: number }) => {
    return await axiosClient.post(`/restaurant-manager/table/save-layout`, payload);
};
