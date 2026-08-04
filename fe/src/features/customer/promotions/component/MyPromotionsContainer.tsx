"use client";

import React, { useState } from "react";
import { RiCoupon3Line } from "react-icons/ri";
import { FaCompass } from "react-icons/fa";
import { useGetMyVoucherWallet } from "../hook/useGetMyVoucherWallet";
import { VoucherStatsHeader } from "./VoucherStatsHeader";
import { AddVoucherBar } from "./AddVoucherBar";
import { VoucherWalletTab } from "./VoucherWalletTab";
import { VoucherDiscoverTab } from "./VoucherDiscoverTab";

export const MyPromotionsContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"WALLET" | "DISCOVER">("WALLET");

    const { data, isLoading } = useGetMyVoucherWallet({ page: 1, limit: 1 });
    const stats = data?.metadata?.stats;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Thẻ Thống kê nhanh */}
            <VoucherStatsHeader stats={stats} isLoading={isLoading} />

            {/* Khối Thêm mã thủ công */}
            <AddVoucherBar />

            {/* Điều hướng Tab chính */}
            <div className="w-full flex items-center justify-between border-b border-gray-200 pb-1 mt-2">
                <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
                    <button
                        type="button"
                        onClick={() => setActiveTab("WALLET")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === "WALLET"
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                        }`}
                    >
                        <RiCoupon3Line className="w-4 h-4" />
                        <span>Ví Voucher của tôi</span>
                        {stats?.activeCount ? (
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                                {stats.activeCount}
                            </span>
                        ) : null}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("DISCOVER")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === "DISCOVER"
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                        }`}
                    >
                        <FaCompass className="w-4 h-4" />
                        <span>Khám phá Ưu đãi</span>
                    </button>
                </div>
            </div>

            {/* Nội dung Tab */}
            <div className="w-full mt-2">
                {activeTab === "WALLET" ? <VoucherWalletTab /> : <VoucherDiscoverTab />}
            </div>
        </div>
    );
};
