import { getTransactionById } from "../repositories/brand_subscription_transaction.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const checkPaymentStatusService = async (transactionId) => {
    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
        throw new NotFoundError("Giao dịch không tồn tại");
    }

    return {
        status: transaction.status,
        subscriptionStatus: transaction.brandSubscription.status
    };
};
