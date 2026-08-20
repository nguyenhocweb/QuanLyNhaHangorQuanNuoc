import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getTransactionRepo } from "../repositories/subscription.transaction.get.repo.js";

export const getTransactionService = async (subscriptionId) => {
    const transaction = await getTransactionRepo(subscriptionId);
    if (!transaction) {
        throw new NotFoundError("Không tìm thấy thông tin giao dịch cho gói cước này");
    }
    return transaction;
};
