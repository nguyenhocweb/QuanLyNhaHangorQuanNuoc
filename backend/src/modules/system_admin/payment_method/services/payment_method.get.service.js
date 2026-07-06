import { getPaymentMethodsRepo, getPaymentMethodByIdRepo } from "../repositories/payment_method.get.repo.js";

export const getPaymentMethodsService = async () => {
    return await getPaymentMethodsRepo();
};

export const getPaymentMethodByIdService = async (id) => {
    return await getPaymentMethodByIdRepo(id);
};
