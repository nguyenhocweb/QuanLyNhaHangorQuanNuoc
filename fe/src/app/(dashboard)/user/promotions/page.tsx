"use client";

import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { MyPromotionsContainer } from '@/src/features/customer/promotions/component/MyPromotionsContainer';

export default function UserPromotionsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Ví Voucher & Ưu Đãi</h1>
                <p className="text-gray-500 text-sm">Quản lý các mã khuyến mãi bạn đã thu thập, theo dõi hạn sử dụng hoặc khám phá ưu đãi hấp dẫn từ Foleat.</p>
            </div>

            <MyPromotionsContainer />
        </FadeIn>
    );
}
