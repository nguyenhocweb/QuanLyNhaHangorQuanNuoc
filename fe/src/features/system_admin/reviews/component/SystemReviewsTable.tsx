"use client";

import React, { useState } from "react";
import { useGetSystemReviews } from "../hook/useGetSystemReviews";
import { useUpdateReviewStatus } from "../hook/useUpdateReviewStatus";
import { FaStar, FaFilter, FaChevronLeft, FaChevronRight, FaSearch, FaEye, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { MdOutlineRateReview, MdOutlineStorefront } from "react-icons/md";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { ReviewDetailModal } from "./ReviewDetailModal";
import useDebounce from "@/src/core/hooks/useDebounce";

export const SystemReviewsTable = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isPublicFilter, setIsPublicFilter] = useState<string>("");
    const [rating, setRating] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");

    const debouncedSearch = useDebounce({ value: searchInput, delay: 400 });

    const { data, isLoading } = useGetSystemReviews({
        page,
        limit,
        ...(isPublicFilter !== "" && { is_public: isPublicFilter }),
        ...(rating && { rating }),
        ...(debouncedSearch && { search: debouncedSearch })
    });

    const { mutate: updateStatus, isPending: isUpdating } = useUpdateReviewStatus();

    // Modals state
    const [selectedReview, setSelectedReview] = useState<any | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [actionReview, setActionReview] = useState<any | null>(null);

    const reviews = data?.metadata?.reviews || [];
    const pagination = data?.metadata?.pagination;

    const handleToggleVisibilityConfirm = () => {
        if (!actionReview) return;
        const targetState = !actionReview.is_public;
        updateStatus(
            { reviewId: actionReview.id, data: { is_public: targetState } },
            {
                onSettled: () => setActionReview(null)
            }
        );
    };

    const handleOpenDetail = (review: any) => {
        setSelectedReview(review);
        setIsDetailOpen(true);
    };

    return (
        <FadeIn className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <MdOutlineRateReview className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Danh sách Đánh giá Hệ thống</h2>
                        <p className="text-xs text-gray-500">Giám sát và kiểm duyệt toàn bộ phản hồi từ thực khách</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-64">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Tìm khách hàng, nhà hàng, nội dung..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* Visibility Filter */}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <FaFilter className="text-gray-400 text-xs" />
                        <select
                            value={isPublicFilter}
                            onChange={(e) => {
                                setIsPublicFilter(e.target.value);
                                setPage(1);
                            }}
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="true">Công khai</option>
                            <option value="false">Đang bị ẩn</option>
                        </select>
                    </div>

                    {/* Star Rating Filter */}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                        <FaStar className="text-amber-400 text-xs" />
                        <select
                            value={rating}
                            onChange={(e) => {
                                setRating(e.target.value);
                                setPage(1);
                            }}
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            <option value="">Tất cả số sao</option>
                            <option value="5">5 Sao (Xuất sắc)</option>
                            <option value="4">4 Sao (Tốt)</option>
                            <option value="3">3 Sao (Bình thường)</option>
                            <option value="2">2 Sao (Kém)</option>
                            <option value="1">1 Sao (Rất tệ)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="py-3.5 px-4">Khách hàng</th>
                            <th className="py-3.5 px-4">Nhà hàng & Thương hiệu</th>
                            <th className="py-3.5 px-4">Điểm số</th>
                            <th className="py-3.5 px-4">Nội dung nhận xét</th>
                            <th className="py-3.5 px-4">Trạng thái</th>
                            <th className="py-3.5 px-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-500">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent mr-2 align-middle"></div>
                                    Đang tải danh sách đánh giá...
                                </td>
                            </tr>
                        ) : reviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                    Không tìm thấy đánh giá nào phù hợp
                                </td>
                            </tr>
                        ) : (
                            reviews.map((review: any) => (
                                <tr key={review.id} className="hover:bg-gray-50/70 transition-colors">
                                    {/* User */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
                                                {review.user?.avatar ? (
                                                    <img
                                                        src={review.user.avatar}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xs">
                                                        {review.user?.name?.charAt(0) || "U"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate max-w-[140px]">
                                                    {review.user?.name || "Khách hàng"}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate max-w-[140px]">
                                                    {review.user?.email || "Chưa có email"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Restaurant */}
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                                                <MdOutlineStorefront className="text-gray-400" />
                                                {review.restaurant?.name || "N/A"}
                                            </span>
                                            <span className="text-xs text-indigo-600 font-medium">
                                                {review.restaurant?.brand?.name || "Thương hiệu"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Rating */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-gray-900 text-base">{review.overall_rating}</span>
                                            <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FaStar
                                                        key={s}
                                                        className={`w-3.5 h-3.5 ${s <= review.overall_rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Comment */}
                                    <td className="py-4 px-4 max-w-xs">
                                        <p className="text-gray-600 truncate" title={review.comment || ""}>
                                            {review.comment ? (
                                                `"${review.comment}"`
                                            ) : (
                                                <span className="text-gray-400 italic">Không có nhận xét</span>
                                            )}
                                        </p>
                                        {review.staff_response && (
                                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                                                Đã có phản hồi từ quán
                                            </span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-4">
                                        {review.is_public ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Công khai
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                Đang bị ẩn
                                            </span>
                                        )}
                                    </td>

                                    {/* Action */}
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* View detail button */}
                                            <button
                                                onClick={() => handleOpenDetail(review)}
                                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                title="Xem chi tiết & đối soát"
                                            >
                                                <FaEye className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Toggle visibility button */}
                                            <button
                                                onClick={() => setActionReview(review)}
                                                disabled={isUpdating}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    review.is_public
                                                        ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                                                        : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                                                }`}
                                                title={review.is_public ? "Ẩn đánh giá vi phạm" : "Mở công khai đánh giá"}
                                            >
                                                {review.is_public ? (
                                                    <FaRegEyeSlash className="w-3.5 h-3.5" />
                                                ) : (
                                                    <FaRegEye className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <span className="text-xs sm:text-sm text-gray-500">
                        Hiển thị {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} đến{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
                    </span>

                    <div className="flex items-center gap-3">
                        {/* Rows per page */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400">Hiển thị:</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white cursor-pointer focus:outline-none"
                            >
                                <option value={5}>5 / trang</option>
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                                <option value={50}>50 / trang</option>
                            </select>
                        </div>

                        {/* Page Buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
                            >
                                <FaChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg">
                                {page} / {Math.max(1, pagination.totalPages)}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                                disabled={page >= (pagination.totalPages || 1)}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
                            >
                                <FaChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Visibility Modal */}
            <ConfirmModal
                open={!!actionReview}
                onClose={() => setActionReview(null)}
                onConfirm={handleToggleVisibilityConfirm}
                title={actionReview?.is_public ? "Xác nhận ẩn đánh giá" : "Xác nhận công khai đánh giá"}
                content={
                    actionReview?.is_public
                        ? "Bạn có chắc chắn muốn ẩn đánh giá này khỏi hiển thị công khai trên toàn hệ thống không?"
                        : "Bạn có chắc chắn muốn mở lại hiển thị công khai cho đánh giá này không?"
                }
                confirmText={actionReview?.is_public ? "Ẩn đánh giá" : "Công khai lại"}
                cancelText="Hủy"
            />

            {/* Detail Inspection Modal */}
            <ReviewDetailModal
                review={selectedReview}
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedReview(null);
                }}
            />
        </FadeIn>
    );
};

export default SystemReviewsTable;
