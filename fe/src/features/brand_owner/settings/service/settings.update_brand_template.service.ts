import axiosClient from "@/src/core/api/axios-instance";

export const updateBrandTemplateService = async (templateId: string): Promise<{ message: string }> => {
    return axiosClient.put("/brand-owner/brand/template", { templateId });
};
