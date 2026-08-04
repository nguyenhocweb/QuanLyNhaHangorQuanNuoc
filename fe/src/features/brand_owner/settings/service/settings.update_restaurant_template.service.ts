import axiosClient from "@/src/core/api/axios-instance";

export const updateRestaurantTemplateService = async (data: { brandId: string, templateId: string }): Promise<{ message: string }> => {
    return axiosClient.put(`/brand-owner/${data.brandId}/restaurant/template`, { templateId: data.templateId });
};
