"use client";

import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { MyReviewsContainer } from '@/src/features/customer/reviews/component/MyReviewsContainer';

export default function UserReviewsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
                <p className="text-gray-500 text-sm">Xem lại lịch sử nhận xét của bạn hoặc viết đánh giá cho các bữa ăn vừa trải nghiệm tại hệ thống Foleat.</p>
            </div>

            <MyReviewsContainer />
        </FadeIn>
    );
}
