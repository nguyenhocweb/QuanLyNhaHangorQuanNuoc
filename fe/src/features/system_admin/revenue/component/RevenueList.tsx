"use client";

import React, { useState, useEffect } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useRevenueList } from "../hook/useRevenue_hook";
import { useGetSubscriptions } from "../../subscriptions/hook/useSubscription_hook";
import { H } from "../../../../core/components/ui";
import TransactionModal from "./TransactionModal";

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
};

const formatDateOnly = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
};

export default function RevenueList() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(currentMonth);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: response, isLoading, error } = useRevenueList({ 
        month: selectedMonth, 
        year: selectedYear,
        page: currentPage,
        limit: itemsPerPage,
        planName: selectedPlan || undefined,
        status: selectedStatus || undefined,
        search: debouncedSearch || undefined
    });

    const { data: subscriptionRes } = useGetSubscriptions({ limit: 100 });
    const uniquePlans = subscriptionRes?.data || [];

    const revenues = response?.data || [];
    const pagination = response?.pagination;
    const totalRevenue = response?.totalRevenue || 0;
    const totalPages = pagination?.totalPages || 1;
    const totalItems = pagination?.totalItems || 0;
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <FadeIn>
        <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
            {/* Header & Total */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                    <H variant="text_black" className="text-2xl font-bold text-gray-900">
                        Giao dịch Gói dịch vụ
                    </H>
                    <p className="text-gray-500 mt-1">Lịch sử thanh toán gói cước của các thương hiệu (Doanh thu System Admin)</p>
                    <div className="mt-4">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Thêm lịch sử giao dịch
                        </button>
                    </div>
                </div>

                <div className="bg-indigo-50 px-6 py-4 rounded-xl border border-indigo-100 min-w-[250px] shadow-sm flex flex-col justify-center">
                    <span className="text-sm text-indigo-600 font-medium block mb-1">
                        Tổng doanh thu {selectedMonth ? `Tháng ${selectedMonth}/` : `Năm `}{selectedYear}
                    </span>
                    <span className="text-3xl font-bold text-indigo-900">
                        {totalRevenue.toLocaleString("vi-VN")} ₫
                    </span>
                </div>
            </div>

            {/* Year & Month Selection */}
            <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Năm:</label>
                    <select 
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                        value={selectedYear || ""}
                        onChange={(e) => {
                            setSelectedYear(e.target.value ? Number(e.target.value) : null);
                            setCurrentPage(1);
                        }}
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <option key={i} value={currentYear - i}>{currentYear - i}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Tháng:</label>
                    <select 
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                        value={selectedMonth || ""}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value ? Number(e.target.value) : null);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Cả năm</option>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Filters: Search and Dropdowns */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="w-full md:max-w-md relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                        placeholder="Tìm kiếm theo tên hoặc ID thương hiệu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Right Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Gói cước:</label>
                        <select 
                            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 shadow-sm"
                            value={selectedPlan}
                            onChange={(e) => {
                                setSelectedPlan(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả</option>
                            {uniquePlans.map((plan: any) => (
                                <option key={plan.id} value={plan.name}>{plan.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Trạng thái:</label>
                        <select 
                            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 shadow-sm"
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả</option>
                            <option value="ACTIVE">Đang sử dụng</option>
                            <option value="EXPIRED">Chưa gia hạn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full overflow-x-auto flex flex-col">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">Lỗi khi tải dữ liệu doanh thu</div>
                ) : (
                    <>
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="py-3 px-4 w-[25%]">Thương hiệu</th>
                                    <th className="py-3 px-4 w-[15%]">Gói dịch vụ</th>
                                    <th className="py-3 px-4 w-[15%] text-right">Số tiền thanh toán</th>
                                    <th className="py-3 px-4 w-[15%]">Ngày đăng ký</th>
                                    <th className="py-3 px-4 w-[10%]">Ngày hết hạn</th>
                                    <th className="py-3 px-4 w-[10%] text-center">Trạng thái</th>
                                    <th className="py-3 px-4 w-[10%] text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {revenues.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-500">
                                            Chưa có giao dịch thanh toán nào phù hợp với bộ lọc
                                        </td>
                                    </tr>
                                ) : (
                                    revenues.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shrink-0">
                                                            {record.brandLogo ? (
                                                                <img src={record.brandLogo} alt={record.brandName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                record.brandName.charAt(0)
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-900 line-clamp-1">{record.brandName}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-mono ml-11" title="Brand ID">ID: {record.brandId}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium text-xs border border-blue-100 whitespace-nowrap">
                                                    {record.planName}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                                                {record.price.toLocaleString("vi-VN")} ₫
                                            </td>
                                            <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                                                {formatDate(record.startDate)}
                                            </td>
                                            <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                                                {formatDateOnly(record.endDate)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {record.status === "ACTIVE" ? (
                                                    <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-medium text-xs border border-green-100 whitespace-nowrap">
                                                        Đang sử dụng
                                                    </span>
                                                ) : record.status === "EXPIRED" ? (
                                                    <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-medium text-xs border border-red-100 whitespace-nowrap">
                                                        Chưa gia hạn
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium text-xs border border-gray-200 whitespace-nowrap">
                                                        {record.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedSubscriptionId(record.id)}
                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Xem chi tiết giao dịch"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 mt-auto">
                                <span className="text-sm text-gray-600 hidden sm:inline">
                                    Hiển thị <span className="font-medium text-gray-900">{startIndex + 1}</span> đến <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> trong số <span className="font-medium text-gray-900">{totalItems}</span> giao dịch
                                </span>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Dòng/trang:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                    >
                                        Trước
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }).map((_, i) => {
                                            if (totalPages > 7 && (i < currentPage - 2 || i > currentPage) && i !== 0 && i !== totalPages - 1) {
                                                if (i === currentPage - 3 || i === currentPage + 1) return <span key={i} className="px-2 text-gray-500">...</span>;
                                                return null;
                                            }
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === i + 1 
                                                            ? 'bg-indigo-600 text-white' 
                                                            : 'text-gray-600 hover:bg-gray-100 bg-white'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {selectedSubscriptionId && (
                <TransactionModal 
                    subscriptionId={selectedSubscriptionId} 
                    onClose={() => setSelectedSubscriptionId(null)} 
                />
            )}
        </div>
        </FadeIn>
    );
}
