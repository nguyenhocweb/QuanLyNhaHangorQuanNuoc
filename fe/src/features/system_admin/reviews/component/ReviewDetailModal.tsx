"use client";

import React from "react";
import { FaStar, FaTimes, FaCalendarAlt, FaUsers, FaStore, FaUser, FaReply } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface ReviewDetailModalProps {
    review: any | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, isOpen, onClose }) => {
    if (!isOpen || !review) return null;

    const renderStars = (rating?: number) => {
        const r = rating || 0;
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`w-4 h-4 ${star <= r ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                    />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-gray-700">{r}/5</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-gray-900">Chi tiết Đánh giá & Đối soát</h3>
                        {review.is_public ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                <MdVisibility className="text-xs" /> Công khai
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                                <MdVisibilityOff className="text-xs" /> Đang ẩn
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex flex-col gap-6 text-sm">
                    {/* User & Restaurant Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {/* User */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                                {review.user?.avatar ? (
                                    <img src={review.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <FaUser />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-medium text-gray-400">Khách hàng</span>
                                <p className="font-semibold text-gray-900 truncate">{review.user?.name || "Khách hàng"}</p>
                                <p className="text-xs text-gray-500 truncate">{review.user?.email || "Không có email"}</p>
                            </div>
                        </div>

                        {/* Restaurant */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                                <FaStore className="text-lg" />
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs font-medium text-gray-400">Nhà hàng & Thương hiệu</span>
                                <p className="font-semibold text-gray-900 truncate">{review.restaurant?.name || "Chi nhánh"}</p>
                                <p className="text-xs text-indigo-600 font-medium truncate">{review.restaurant?.brand?.name || "Thương hiệu"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ratings Matrix */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-gray-800 text-sm">Điểm số đánh giá chi tiết</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex flex-col gap-1">
                                <span className="text-xs text-amber-800 font-medium">Tổng quan</span>
                                {renderStars(review.overall_rating)}
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                                <span className="text-xs text-gray-600 font-medium">Món ăn</span>
                                {renderStars(review.food_rating)}
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                                <span className="text-xs text-gray-600 font-medium">Dịch vụ</span>
                                {renderStars(review.service_rating)}
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                                <span className="text-xs text-gray-600 font-medium">Không gian</span>
                                {renderStars(review.ambiance_rating)}
                            </div>
                        </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-gray-800 text-sm">Nội dung nhận xét từ khách hàng</h4>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 text-gray-700 leading-relaxed italic">
                            {review.comment ? `"${review.comment}"` : <span className="text-gray-400 not-italic">Khách hàng không để lại nhận xét văn bản.</span>}
                        </div>
                    </div>

                    {/* Staff Response */}
                    {review.staff_response && (
                        <div className="flex flex-col gap-2">
                            <h4 className="font-semibold text-emerald-800 text-sm flex items-center gap-2">
                                <FaReply /> Phản hồi từ đại diện Nhà hàng
                            </h4>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 leading-relaxed">
                                {review.staff_response}
                            </div>
                        </div>
                    )}

                    {/* Reservation Information */}
                    {review.reservation && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                            <h4 className="font-semibold text-gray-800 text-sm">Thông tin đơn đặt bàn liên kết</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span>
                                        Ngày: {review.reservation.reservation_date ? new Date(review.reservation.reservation_date).toLocaleDateString("vi-VN") : "N/A"}
                                        {review.reservation.start_time ? ` (${review.reservation.start_time})` : ""}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaUsers className="text-gray-400" />
                                    <span>Số khách: {review.reservation.party_size || "N/A"} người</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>Mã đặt bàn: <strong className="text-indigo-600 font-mono">{review.reservation.confirmation_code || "N/A"}</strong></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-xs text-gray-400 flex justify-between items-center pt-2 border-t border-gray-100">
                        <span>Đăng lúc: {review.createdAt ? new Date(review.createdAt).toLocaleString("vi-VN") : "N/A"}</span>
                        <span>Mã ID: {review.id}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-all"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
