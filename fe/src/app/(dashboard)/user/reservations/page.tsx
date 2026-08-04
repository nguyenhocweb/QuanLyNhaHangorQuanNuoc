"use client";

import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ReservationHistoryList } from '@/src/features/customer/reservations/component/ReservationHistoryList';

export default function ReservationHistoryPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Lịch sử đặt bàn</h1>
                <p className="text-gray-500 text-sm">Quản lý các lịch hẹn dùng bữa của bạn tại các nhà hàng trên hệ thống Foleat.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                <ReservationHistoryList />
            </div>
        </FadeIn>
    );
}
