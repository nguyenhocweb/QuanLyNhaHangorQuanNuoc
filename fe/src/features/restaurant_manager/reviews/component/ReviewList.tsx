"use client";
import React, { useState } from "react";
import { useGetReviews } from "../hook/useGetReviews";
import { ReviewAnalytics } from "./ReviewAnalytics";
import { ReviewCard } from "./ReviewCard";

import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

export const ReviewList = () => {
    const [rating, setRating] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [hasResponse, setHasResponse] = useState<string>("");

    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id;

    const { data, isLoading } = useGetReviews({ restaurantId, rating, status, has_response: hasResponse });
    const reviewsData = data?.metadata;

    return (
        <div className="w-full flex flex-col gap-6 p-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đánh Giá</h1>
            
            {/* Analytics */}
            {reviewsData?.stats && <ReviewAnalytics stats={reviewsData.stats} />}

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm w-full flex-wrap">
                <select 
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white"
                    value={rating} 
                    onChange={e => setRating(e.target.value)}
                >
                    <option value="">Tất cả sao</option>
                    <option value="5">5 Sao</option>
                    <option value="4">4 Sao</option>
                    <option value="3">3 Sao</option>
                    <option value="2">2 Sao</option>
                    <option value="1">1 Sao</option>
                </select>
                <select 
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white"
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="APPROVED">Đã duyệt (Công khai)</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="REJECTED_SPAM">Spam</option>
                </select>
                <select 
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white"
                    value={hasResponse} 
                    onChange={e => setHasResponse(e.target.value)}
                >
                    <option value="">Tất cả phản hồi</option>
                    <option value="true">Đã phản hồi</option>
                    <option value="false">Chưa phản hồi</option>
                </select>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4 w-full">
                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Đang tải dữ liệu...</div>
                ) : reviewsData?.reviews?.length ? (
                    reviewsData.reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100">
                        Chưa có đánh giá nào phù hợp với bộ lọc.
                    </div>
                )}
            </div>
        </div>
    );
};