import axiosClient from "@/src/core/api/axios-instance";

export const checkMyBrandPaymentStatusService = async (transactionId: string) => {
    const { data } = await axiosClient.get(`/brand-owner/brand/subscription/check-payment-status/${transactionId}`);
    return data;
};
