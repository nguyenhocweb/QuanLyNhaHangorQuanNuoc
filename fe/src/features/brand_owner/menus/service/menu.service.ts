import axiosClient from "@/src/core/api/axios-instance";
import { MenuItemFormValues } from "../schema/menu_item.schema";
import { MenuCategoryFormValues } from "../schema/menu_category.schema";

const ITEM_API = "/brand-owner/menu/items";
const CATEGORY_API = "/brand-owner/menu/categories";

// Categories
export const getMenuCategories = async (params: { page: number; limit: number; search?: string; is_active?: string | boolean; sort_order?: string | number }) => {
    const response = await axiosClient.get(CATEGORY_API, { params });
    return response.data;
};

export const createMenuCategory = async (data: MenuCategoryFormValues) => {
    const response = await axiosClient.post(CATEGORY_API, data);
    return response.data;
};

export const updateMenuCategory = async ({ id, data }: { id: string; data: Partial<MenuCategoryFormValues> }) => {
    const response = await axiosClient.put(`${CATEGORY_API}/${id}`, data);
    return response.data;
};

export const deleteMenuCategory = async (id: string) => {
    const response = await axiosClient.delete(`${CATEGORY_API}/${id}`);
    return response.data;
};

// Items
export const getMenuItems = async (params: { page: number; limit: number; search?: string; categoryId?: string; menuId?: string; restaurantId?: string; isAvailable?: string; isAssigned?: string }) => {
    const response = await axiosClient.get(ITEM_API, { params });
    return response.data;
};

export const createMenuItem = async (data: MenuItemFormValues) => {
    const response = await axiosClient.post(ITEM_API, data);
    return response.data;
};

export const updateMenuItem = async ({ id, data }: { id: string; data: Partial<MenuItemFormValues> }) => {
    const response = await axiosClient.put(`${ITEM_API}/${id}`, data);
    return response.data;
};

export const deleteMenuItem = async (id: string) => {
    const response = await axiosClient.delete(`${ITEM_API}/${id}`);
    return response.data;
};
