"use client";

import React from "react";
import { FaCopy, FaCheckCircle, FaStore, FaTag, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "sonner";
import { Promotion } from "../type/promotion.type";
import Link from "next/link";

interface VoucherCardProps {
    promotion: Promotion;
    isUsed?: boolean;
    savedAt?: string;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({ promotion, isUsed = false }) => {
    const handleCopyCode = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isUsed) {
            navigator.clipboard.writeText(promotion.code);
            toast.success(`Đã sao chép mã voucher "${promotion.code}" vào khay nhớ tạm!`);
        }
    };

    // Kiểm tra sắp hết hạn (trong 3 ngày)
    const now = new Date();
    const validUntilDate = new Date(promotion.validUntil);
    const diffTime = validUntilDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isExpiringSoon = !isUsed && diffDays > 0 && diffDays <= 3;
    const isExpired = !isUsed && diffTime <= 0;

    // Phân loại màu sắc thẻ ticket theo discountType
    const isPercentage = promotion.discountType === "PERCENTAGE";
    const bgBadge = isPercentage ? "bg-amber-500" : "bg-indigo-600";
    const borderAccent = isPercentage ? "border-l-amber-500" : "border-l-indigo-600";

    return (
        <div className={`w-full bg-white rounded-2xl border ${isUsed || isExpired ? "border-gray-200 opacity-60 bg-gray-50/50" : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"} transition-all duration-200 flex flex-col sm:flex-row overflow-hidden relative group`}>
            {/* Nhãn trạng thái góc phải */}
            {isUsed && (
                <div className="absolute top-3 right-3 bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                    <FaCheckCircle className="w-3 h-3 text-gray-600" />
                    <span>Đã sử dụng</span>
                </div>
            )}
            {isExpired && !isUsed && (
                <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                    <FaExclamationTriangle className="w-3 h-3 text-red-600" />
                    <span>Hết hạn</span>
                </div>
            )}
            {isExpiringSoon && (
                <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10 animate-pulse">
                    <FaExclamationTriangle className="w-3 h-3 text-amber-600" />
                    <span>Hết hạn trong {diffDays} ngày</span>
                </div>
            )}

            {/* Cạnh trái: Thông tin Nhà hàng / Hệ thống */}
            <div className={`sm:w-1/3 p-5 border-l-4 ${borderAccent} bg-gradient-to-br from-gray-50/80 to-white flex flex-col justify-center items-center sm:items-start border-b sm:border-b-0 sm:border-r border-dashed border-gray-200 relative`}>
                <div className="flex items-center gap-2.5 w-full mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200/60">
                        {promotion.restaurant?.logo ? (
                            <img src={promotion.restaurant.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <FaStore className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                            {promotion.restaurantId ? "Nhà hàng" : "Toàn hệ thống"}
                        </span>
                        <h4 className="text-sm font-bold text-gray-800 truncate">
                            {promotion.restaurant?.name || promotion.brand?.name || "Foleat Dining"}
                        </h4>
                    </div>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${bgBadge}`}>
                        {isPercentage ? "GIẢM %" : "TIỀN MẶT"}
                    </span>
                </div>
            </div>

            {/* Cạnh phải: Chi tiết Giảm giá & Nút Thao tác */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FaTag className="w-4 h-4 text-indigo-600 shrink-0" />
                        <h3 className="text-lg font-bold text-gray-800">
                            {isPercentage ? (
                                <>
                                    Giảm <span className="text-amber-600">{promotion.discountValue}%</span>
                                    {promotion.maxDiscount ? ` tối đa ${promotion.maxDiscount.toLocaleString("vi-VN")}đ` : ""}
                                </>
                            ) : (
                                <>
                                    Giảm thẳng <span className="text-indigo-600">{promotion.discountValue.toLocaleString("vi-VN")}đ</span>
                                </>
                            )}
                        </h3>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {promotion.description || `Đơn tối thiểu ${promotion.minOrderValue ? promotion.minOrderValue.toLocaleString("vi-VN") + "đ" : "0đ"}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>
                            Đơn tối thiểu: <strong className="text-gray-700">{promotion.minOrderValue ? `${promotion.minOrderValue.toLocaleString("vi-VN")}đ` : "0đ"}</strong>
                        </span>
                        <span>•</span>
                        <span>
                            HSD: <strong className="text-gray-700">{new Date(promotion.validUntil).toLocaleDateString("vi-VN")}</strong>
                        </span>
                    </div>

                    {/* Thanh tiến độ sử dụng nếu có giới hạn */}
                    {promotion.usageLimit && promotion.usageLimit > 0 && (
                        <div className="mt-3 w-full">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Đã dùng: {promotion.usedCount} / {promotion.usageLimit}</span>
                                <span>{Math.round((promotion.usedCount / promotion.usageLimit) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, (promotion.usedCount / promotion.usageLimit) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Hành động dưới cùng */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/60 font-mono text-sm font-bold text-gray-800 tracking-wider">
                        <span>{promotion.code}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopyCode}
                            disabled={isUsed || isExpired}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <FaCopy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                        </button>

                        {promotion.restaurantId && !isUsed && !isExpired && (
                            <Link
                                href={`/restaurant/${promotion.restaurantId}`}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5"
                            >
                                Đặt bàn ngay
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
