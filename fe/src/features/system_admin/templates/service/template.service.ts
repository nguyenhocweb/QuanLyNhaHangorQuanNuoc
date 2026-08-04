import axiosClient from "@/src/core/api/axios-instance";
import { ITemplate, ITemplateResponse } from "../type/template.type";
import { TemplateFormValues } from "../schema/template.schema";

export const getTemplatesService = async (params?: { type?: string }): Promise<ITemplateResponse> => {
    const res = await axiosClient.get("/system-admin/template", { params });
    return res.data;
};

export const createTemplateService = async (data: TemplateFormValues): Promise<{ message: string; metadata: ITemplate }> => {
    const res = await axiosClient.post("/system-admin/template", data);
    return res.data;
};

export const updateTemplateService = async (data: { id: string; payload: TemplateFormValues }): Promise<{ message: string; metadata: ITemplate }> => {
    const res = await axiosClient.put(`/system-admin/template/${data.id}`, data.payload);
    return res.data;
};

export const deleteTemplateService = async (id: string): Promise<{ message: string }> => {
    const res = await axiosClient.delete(`/system-admin/template/${id}`);
    return res.data;
};
