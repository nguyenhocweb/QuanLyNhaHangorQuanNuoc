"use client";
import React, { useState } from "react";
import { Review } from "../type/review.type";
import { FaStar, FaReply, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { useReplyReview } from "../hook/useReplyReview";
import { useUpdateReviewStatus } from "../hook/useUpdateReviewStatus";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

export const ReviewCard = ({ review }: { review: Review }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const replyMutation = useReplyReview();
    const statusMutation = useUpdateReviewStatus();
    
    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id;

    const handleReply = () => {
        if (!replyText.trim()) return;
        replyMutation.mutate({ id: review.id, staff_response: replyText, restaurantId }, {
            onSuccess: () => {
                setIsReplying(false);
            }
        });
    };

    const handleUpdateStatus = (status: "APPROVED" | "REJECTED_SPAM") => {
        statusMutation.mutate({ id: review.id, status, restaurantId });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {review.user?.avatar ? (
                            <img src={review.user.avatar} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-indigo-100">
                                {review.user?.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{review.user?.name || "Khách hàng"}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })} • Đặt bàn: #{review.reservation?.code || "N/A"}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {review.status === "APPROVED" && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg flex items-center gap-1"><FaCheckCircle/> Hiển thị</span>}
                    {review.status === "PENDING" && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-lg flex items-center gap-1"><FaClock/> Chờ duyệt</span>}
                    {review.status === "REJECTED_SPAM" && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg flex items-center gap-1"><FaTimesCircle/> Spam</span>}
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.overall_rating ? "" : "text-gray-200"} />
                    ))}
                </div>
                <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md">Đồ ăn: {review.food_rating || review.overall_rating}</span>
                    <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">Dịch vụ: {review.service_rating || review.overall_rating}</span>
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-md">Không gian: {review.ambiance_rating || review.overall_rating}</span>
                </div>
            </div>

            {review.comment && (
                <div className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
                    "{review.comment}"
                </div>
            )}

            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {review.images.map((img, idx) => (
                        <img key={idx} src={img} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                    ))}
                </div>
            )}

            {review.staff_response ? (
                <div className="ml-8 mt-4 p-4 bg-gray-50 border-l-4 border-indigo-500 rounded-r-lg">
                    <div className="font-semibold text-sm text-indigo-700 mb-1 flex items-center gap-2">
                        <FaReply /> Nhà hàng phản hồi
                    </div>
                    <div className="text-gray-700 text-sm whitespace-pre-wrap">{review.staff_response}</div>
                </div>
            ) : (
                <div className="mt-4 flex flex-col gap-3">
                    {!isReplying ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsReplying(true)}
                                className="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-all flex items-center gap-2"
                            >
                                <FaReply /> Phản hồi khách
                            </button>
                            {review.status !== "APPROVED" && (
                                <button 
                                    onClick={() => handleUpdateStatus("APPROVED")}
                                    className="px-4 py-2 text-sm border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-all"
                                >
                                    Duyệt hiện công khai
                                </button>
                            )}
                            {review.status !== "REJECTED_SPAM" && (
                                <button 
                                    onClick={() => handleUpdateStatus("REJECTED_SPAM")}
                                    className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                                >
                                    Đánh dấu Spam
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Viết phản hồi của nhà hàng..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                                <button 
                                    onClick={() => setIsReplying(false)}
                                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    Hủy
                                </button>
                                <button 
                                    onClick={handleReply}
                                    disabled={replyMutation.isPending}
                                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    {replyMutation.isPending ? "Đang gửi..." : "Gửi phản hồi"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};