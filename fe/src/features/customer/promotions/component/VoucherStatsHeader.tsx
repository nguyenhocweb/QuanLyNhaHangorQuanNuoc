"use client";

import React from "react";
import { RiCoupon3Line } from "react-icons/ri";
import { FaCheckCircle, FaClock, FaHistory } from "react-icons/fa";
import { WalletStats } from "../type/promotion.type";

interface VoucherStatsHeaderProps {
    stats?: WalletStats;
    isLoading?: boolean;
}

export const VoucherStatsHeader: React.FC<VoucherStatsHeaderProps> = ({ stats, isLoading }) => {
    const defaultStats = {
        totalSaved: stats?.totalSaved ?? 0,
        activeCount: stats?.activeCount ?? 0,
        expiringSoonCount: stats?.expiringSoonCount ?? 0,
        usedCount: stats?.usedCount ?? 0
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Thẻ 1: Tổng mã trong ví */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <RiCoupon3Line className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Tổng mã trong ví</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-0.5">
                        {isLoading ? "..." : defaultStats.totalSaved}
                    </h3>
                </div>
            </div>

            {/* Thẻ 2: Có thể dùng ngay */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FaCheckCircle className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Có thể dùng ngay</p>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">
                        {isLoading ? "..." : defaultStats.activeCount}
                    </h3>
                </div>
            </div>

            {/* Thẻ 3: Sắp hết hạn */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <FaClock className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Sắp hết hạn (3 ngày)</p>
                    <h3 className="text-2xl font-bold text-amber-600 mt-0.5">
                        {isLoading ? "..." : defaultStats.expiringSoonCount}
                    </h3>
                </div>
            </div>

            {/* Thẻ 4: Đã sử dụng */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FaHistory className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Đã sử dụng</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-0.5">
                        {isLoading ? "..." : defaultStats.usedCount}
                    </h3>
                </div>
            </div>
        </div>
    );
};
