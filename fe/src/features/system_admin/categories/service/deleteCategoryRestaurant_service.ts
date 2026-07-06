import axiosClient from "@/src/core/api/axios-instance";

export const deleteCategoryRestaurantService = async (id: string): Promise<any> => {
    const res = await axiosClient.delete(`/system-admin/category/${id}`);
    return res.data;
};
