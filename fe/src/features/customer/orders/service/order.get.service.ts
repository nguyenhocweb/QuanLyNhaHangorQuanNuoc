import axiosClient from "@/src/core/api/axios-instance";
import { GetMyOrdersResponse } from "../type/order.type";

export const getMyOrdersService = async (params: { page: number; limit: number; status?: string }): Promise<{ message: string, metadata: GetMyOrdersResponse }> => {
    const res = await axiosClient.get("/customer/order", { params });
    return res.data;
};
