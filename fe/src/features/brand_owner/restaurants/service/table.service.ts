import axiosClient from "@/src/core/api/axios-instance";

export const getTablesByAreaIdService = async (areaId: string) => {
    return await axiosClient.get(`/brand-owner/table/area/${areaId}`);
};

export const createTableService = async (payload: any) => {
    return await axiosClient.post(`/brand-owner/table`, payload);
};

export const updateTableService = async (data: { id: string; payload: any }) => {
    return await axiosClient.put(`/brand-owner/table/${data.id}`, data.payload);
};

export const deleteTableService = async (id: string) => {
    return await axiosClient.delete(`/brand-owner/table/${id}`);
};

export const saveTableLayoutService = async (tables: any[]) => {
    return await axiosClient.post(`/brand-owner/table/save-layout`, { tables });
};
