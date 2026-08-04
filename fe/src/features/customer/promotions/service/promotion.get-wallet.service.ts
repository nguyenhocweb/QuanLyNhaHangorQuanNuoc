import axiosClient from "@/src/core/api/axios-instance";
import { WalletResponse } from "../type/promotion.type";

interface GetWalletParams {
    page?: number;
    limit?: number;
    status?: string;
}

export const getMyVoucherWalletService = async (params: GetWalletParams = {}): Promise<{ message: string; metadata: WalletResponse }> => {
    const res = await axiosClient.get("/customer/promotion/wallet", { params });
    return res.data;
};
