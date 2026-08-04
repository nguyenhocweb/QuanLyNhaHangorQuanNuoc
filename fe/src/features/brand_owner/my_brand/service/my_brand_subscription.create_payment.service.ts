import axiosClient from "@/src/core/api/axios-instance";

interface CreatePaymentResponse {
    message: string;
    data: {
        transactionId: string;
        subscriptionId: string;
        amount: number;
        description: string;
        qrCodeUrl: string;
    };
}

export const createMyBrandPaymentService = async (planId: string, systemPaymentMethodId?: string) => {
    const { data } = await axiosClient.post<CreatePaymentResponse>('/brand-owner/brand/subscription/create-payment', {
        planId,
        systemPaymentMethodId
    });
    return data;
};
