import axiosClient from "../../../../core/api/axios-instance";
import { PaymentMethod, PaymentMethodFormData } from "../type/payment_method.type";

export const getPaymentMethodsService = async (): Promise<PaymentMethod[]> => {
    const res = await axiosClient.get("/system-admin/payment-method");
    return res.data.data;
};

export const createPaymentMethodService = async (data: PaymentMethodFormData): Promise<PaymentMethod> => {
    const res = await axiosClient.post("/system-admin/payment-method", data);
    return res.data.data;
};

export const updatePaymentMethodService = async ({ id, data }: { id: string; data: Partial<PaymentMethodFormData> }): Promise<PaymentMethod> => {
    const res = await axiosClient.put(`/system-admin/payment-method/${id}`, data);
    return res.data.data;
};

export const deletePaymentMethodService = async (id: string): Promise<void> => {
    await axiosClient.delete(`/system-admin/payment-method/${id}`);
};
