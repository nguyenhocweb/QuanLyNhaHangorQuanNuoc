"use client";

import React, { useState } from "react";
import { RiCoupon3Line } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { useGetMyVoucherWallet } from "../hook/useGetMyVoucherWallet";
import { VoucherCard } from "./VoucherCard";

export const VoucherWalletTab: React.FC = () => {
    const [status, setStatus] = useState<string>("ACTIVE");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const { data, isLoading } = useGetMyVoucherWallet({ page, limit, status });

    const items = data?.metadata?.items || [];
    const pagination = data?.metadata?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

    const statusOptions = [
        { key: "ACTIVE", label: "Có hiệu lực" },
        { key: "EXPIRING_SOON", label: "Sắp hết hạn (3 ngày)" },
        { key: "USED", label: "Đã sử dụng" },
        { key: "EXPIRED", label: "Hết hạn" }
    ];

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Bộ lọc trạng thái */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50 w-fit">
                {statusOptions.map(opt => (
                    <button
                        key={opt.key}
                        type="button"
                        onClick={() => { setStatus(opt.key); setPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            status === opt.key
                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Danh sách thẻ Voucher */}
            {isLoading ? (
                <div className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-100">
                    <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Đang tải ví voucher của bạn...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-100 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-1">
                        <RiCoupon3Line className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700">Không tìm thấy voucher nào</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Ví của bạn hiện chưa có voucher nào trong danh mục này. Hãy chuyển sang Tab "Khám phá Ưu đãi" để tìm mã mới nhé!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    {items.map(item => (
                        <VoucherCard
                            key={item.id}
                            promotion={item.promotion}
                            isUsed={item.isUsed}
                            savedAt={item.savedAt}
                        />
                    ))}
                </div>
            )}

            {/* Phân trang chuẩn theo Design Consistency Guidelines */}
            {pagination.total > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-2">
                    <span className="text-sm text-gray-500 font-medium">
                        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
                    </span>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Hiển thị:</span>
                            <select
                                value={limit}
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={pagination.page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                            >
                                Trước
                            </button>

                            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
                                {pagination.page} / {Math.max(1, pagination.totalPages)}
                            </span>

                            <button
                                type="button"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
