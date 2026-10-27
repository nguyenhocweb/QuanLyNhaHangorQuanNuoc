"use client";

import React from "react";
import { useGetSystemReviewStats } from "../hook/useGetSystemReviewStats";
import { MdOutlineRateReview, MdOutlineStar, MdVisibilityOff, MdQuestionAnswer } from "react-icons/md";
import FadeIn from "@/src/core/components/animation/FadeIn";

export const ReviewStatsCards = () => {
    const { data, isLoading } = useGetSystemReviewStats();
    const stats = data?.metadata;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse h-28 flex flex-col justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-7 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Tổng đánh giá toàn sàn",
            value: stats?.totalReviews || 0,
            icon: <MdOutlineRateReview className="text-2xl" />,
            color: "bg-blue-50 text-blue-600 border-blue-100",
            desc: `${stats?.publicReviews || 0} công khai`
        },
        {
            title: "Điểm đánh giá trung bình",
            value: stats?.avgRatings?.overall ? `${stats.avgRatings.overall} / 5` : "0 / 5",
            icon: <MdOutlineStar className="text-2xl text-amber-500" />,
            color: "bg-amber-50 text-amber-600 border-amber-100",
            desc: `Món: ${stats?.avgRatings?.food || 0} • DV: ${stats?.avgRatings?.service || 0} • Không gian: ${stats?.avgRatings?.ambiance || 0}`
        },
        {
            title: "Đánh giá bị ẩn kiểm duyệt",
            value: stats?.hiddenReviews || 0,
            icon: <MdVisibilityOff className="text-2xl text-rose-500" />,
            color: "bg-rose-50 text-rose-600 border-rose-100",
            desc: "Nội dung vi phạm/Spam"
        },
        {
            title: "Tỷ lệ nhà hàng phản hồi",
            value: stats?.totalReviews 
                ? `${Math.round(((stats?.repliedReviews || 0) / stats.totalReviews) * 100)}%`
                : "0%",
            icon: <MdQuestionAnswer className="text-2xl text-emerald-600" />,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            desc: `${stats?.repliedReviews || 0} phản hồi đã gửi`
        }
    ];

    return (
        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {cards.map((card, idx) => (
                <div 
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{card.title}</span>
                        <div className={`p-2.5 rounded-xl border ${card.color}`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-800 tracking-tight">{card.value}</div>
                        <div className="text-xs text-gray-400 mt-1 truncate">{card.desc}</div>
                    </div>
                </div>
            ))}
        </FadeIn>
    );
};
