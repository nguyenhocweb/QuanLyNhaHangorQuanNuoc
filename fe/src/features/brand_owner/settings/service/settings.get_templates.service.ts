import axiosClient from "@/src/core/api/axios-instance";
import { ITemplate } from "../type/settings.type";

export const getBrandTemplatesService = async (): Promise<{ metadata: ITemplate[] }> => {
    const response = await axiosClient.get("/brand-owner/brand/templates");
    return response.data;
};
