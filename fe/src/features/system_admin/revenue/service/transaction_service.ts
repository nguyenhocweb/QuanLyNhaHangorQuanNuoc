import axiosClient from "../../../../core/api/axios-instance";
import { TransactionResponse } from "../type/transaction.type";

export const getTransactionService = async (subscriptionId: string): Promise<TransactionResponse> => {
    const res = await axiosClient.get(`/system-admin/subscription/transactions/${subscriptionId}`);
    return res.data;
};
