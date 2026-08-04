import { useQuery } from "@tanstack/react-query";
import { getMyVoucherWalletService } from "../service/promotion.get-wallet.service";

interface UseGetWalletParams {
    page?: number;
    limit?: number;
    status?: string;
}

export const useGetMyVoucherWallet = (params: UseGetWalletParams = {}) => {
    return useQuery({
        queryKey: ["CUSTOMER_VOUCHER_WALLET", params.page, params.limit, params.status],
        queryFn: () => getMyVoucherWalletService(params),
        staleTime: 60 * 1000
    });
};
