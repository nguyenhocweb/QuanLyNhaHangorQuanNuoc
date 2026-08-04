"use client";

import React, { useState } from "react";
import { RiCoupon3Line } from "react-icons/ri";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { useGetDiscoverVouchers } from "../hook/useGetDiscoverVouchers";
import { VoucherDiscoverCard } from "./VoucherDiscoverCard";
import useDebounce from "@/src/core/hooks/useDebounce";

export const VoucherDiscoverTab: React.FC = () => {
    const [type, setType] = useState<string>("ALL");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });

    const { data, isLoading } = useGetDiscoverVouchers({
        page,
        limit,
        search: debouncedSearch,
        type
    });

    const items = data?.metadata?.items || [];
    const pagination = data?.metadata?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

    const typeOptions = [
        { key: "ALL", label: "Tất cả khuyến mãi" },
        { key: "PLATFORM", label: "Ưu đãi Hệ thống Foleat" },
        { key: "RESTAURANT", label: "Ưu đãi Nhà hàng" }
    ];

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Thanh lọc loại & tìm kiếm */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                    {typeOptions.map(opt => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => { setType(opt.key); setPage(1); }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                type === opt.key
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="relative min-w-[260px]">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <FaSearch className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        placeholder="Tìm theo mã hoặc nhà hàng..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Danh sách thẻ Khám phá */}
            {isLoading ? (
                <div className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-100">
                    <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Đang tìm khuyến mãi hấp dẫn...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-100 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mb-1">
                        <RiCoupon3Line className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700">Không có khuyến mãi nào phù hợp</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Hiện tại không có ưu đãi nào đang diễn ra trong danh mục này hoặc từ khóa tìm kiếm của bạn. Hãy quay lại sau nhé!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    {items.map(item => (
                        <VoucherDiscoverCard key={item.id} promotion={item} />
                    ))}
                </div>
            )}

            {/* Phân trang */}
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
