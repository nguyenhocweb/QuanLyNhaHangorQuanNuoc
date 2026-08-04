import axiosClient from "@/src/core/api/axios-instance";

export const saveVoucherService = async (identifier: string): Promise<{ message: string; metadata: any }> => {
    const res = await axiosClient.post("/customer/promotion/save", { identifier });
    return res.data;
};
