import axiosClient from "@/src/core/api/axios-instance";
import { GetMyInvoicesResponse } from "../type/invoice.type";

export const getMyInvoicesService = async (params: { page: number; limit: number }): Promise<{ message: string, metadata: GetMyInvoicesResponse }> => {
    const res = await axiosClient.get("/customer/invoice", { params });
    return res.data;
};
