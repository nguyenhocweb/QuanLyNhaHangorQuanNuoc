import { getMyVoucherWalletRepo, getMyVoucherWalletStatsRepo } from "../repositories/promotion.get-wallet.repo.js";

export const getMyVoucherWalletService = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const status = query.status || "ACTIVE"; // ACTIVE, EXPIRING_SOON, USED, EXPIRED

    const [walletData, stats] = await Promise.all([
        getMyVoucherWalletRepo(userId, { page, limit, status }),
        getMyVoucherWalletStatsRepo(userId)
    ]);

    return {
        items: walletData.items,
        stats,
        pagination: {
            page,
            limit,
            total: walletData.total,
            totalPages: Math.ceil(walletData.total / limit)
        }
    };
};
