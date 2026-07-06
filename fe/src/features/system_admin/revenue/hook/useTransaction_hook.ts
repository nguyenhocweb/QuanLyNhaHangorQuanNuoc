import { useQuery } from "@tanstack/react-query";
import { getTransactionService } from "../service/transaction_service";

export const useGetTransaction = (subscriptionId: string | null) => {
    return useQuery({
        queryKey: ["admin_subscription_transaction", subscriptionId],
        queryFn: () => subscriptionId ? getTransactionService(subscriptionId) : null,
        enabled: !!subscriptionId,
        staleTime: 60 * 1000,
    });
};
