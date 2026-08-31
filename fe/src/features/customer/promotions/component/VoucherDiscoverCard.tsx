"use client";

import React from "react";
import { FaBookmark, FaCheckCircle, FaStore, FaTag, FaSpinner } from "react-icons/fa";
import { Promotion } from "../type/promotion.type";
import { useSaveVoucher } from "../hook/useSaveVoucher";

interface VoucherDiscoverCardProps {
    promotion: Promotion;
}

export const VoucherDiscoverCard: React.FC<VoucherDiscoverCardProps> = ({ promotion }) => {
    const { mutate: saveVoucher, isPending } = useSaveVoucher();

    const handleSave = () => {
        if (!promotion.isSaved && !isPending) {
            saveVoucher(promotion.id);
        }
    };

    const discountType = promotion.discountType || (promotion as any).discount_type || "PERCENTAGE";
    const discountValue = promotion.discountValue ?? (promotion as any).discount_value ?? 0;
    const minOrderValue = promotion.minOrderValue ?? (promotion as any).min_order_value ?? 0;
    const maxDiscount = promotion.maxDiscount ?? (promotion as any).max_discount;
    const validUntil = promotion.validUntil || (promotion as any).valid_until || new Date().toISOString();

    const isPercentage = discountType === "PERCENTAGE";
    const bgBadge = isPercentage ? "bg-amber-500" : "bg-indigo-600";
    const borderAccent = isPercentage ? "border-l-amber-500" : "border-l-indigo-600";

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row overflow-hidden relative group">
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
                                    Giảm <span className="text-amber-600">{discountValue}%</span>
                                    {maxDiscount ? ` tối đa ${maxDiscount.toLocaleString("vi-VN")}đ` : ""}
                                </>
                            ) : (
                                <>
                                    Giảm thẳng <span className="text-indigo-600">{discountValue.toLocaleString("vi-VN")}đ</span>
                                </>
                            )}
                        </h3>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {promotion.description || `Đơn tối thiểu ${minOrderValue ? minOrderValue.toLocaleString("vi-VN") + "đ" : "0đ"}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>
                            Đơn tối thiểu: <strong className="text-gray-700">{minOrderValue ? `${minOrderValue.toLocaleString("vi-VN")}đ` : "0đ"}</strong>
                        </span>
                        <span>•</span>
                        <span>
                            HSD: <strong className="text-gray-700">{new Date(validUntil).toLocaleDateString("vi-VN")}</strong>
                        </span>
                    </div>
                </div>

                {/* Hành động dưới cùng */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/60 font-mono text-sm font-bold text-gray-800 tracking-wider">
                        <span>{promotion.code}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={promotion.isSaved || isPending}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 flex items-center gap-2 ${
                            promotion.isSaved
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 pointer-events-none"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow hover:-translate-y-0.5"
                        }`}
                    >
                        {isPending ? (
                            <>
                                <FaSpinner className="w-4 h-4 animate-spin" />
                                <span>Đang lưu...</span>
                            </>
                        ) : promotion.isSaved ? (
                            <>
                                <FaCheckCircle className="w-4 h-4 text-emerald-600" />
                                <span>Đã có trong ví</span>
                            </>
                        ) : (
                            <>
                                <FaBookmark className="w-4 h-4" />
                                <span>Lưu vào ví</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
