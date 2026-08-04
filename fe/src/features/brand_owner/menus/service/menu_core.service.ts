import axiosClient from "@/src/core/api/axios-instance";
import { MenuCoreFormValues } from "../schema/menu_core.schema";

const MENU_CORE_API = "/brand-owner/menu";

export const getMenus = async (params: { page: number; limit: number; search?: string; is_active?: string | boolean; sort_order?: string | number }) => {
    const response = await axiosClient.get(MENU_CORE_API, { params });
    return response.data;
};

export const createMenu = async (data: MenuCoreFormValues) => {
    const response = await axiosClient.post(MENU_CORE_API, data);
    return response.data;
};

export const updateMenu = async ({ id, data }: { id: string; data: Partial<MenuCoreFormValues> }) => {
    const response = await axiosClient.put(`${MENU_CORE_API}/${id}`, data);
    return response.data;
};

export const deleteMenu = async (id: string) => {
    const response = await axiosClient.delete(`${MENU_CORE_API}/${id}`);
    return response.data;
};
