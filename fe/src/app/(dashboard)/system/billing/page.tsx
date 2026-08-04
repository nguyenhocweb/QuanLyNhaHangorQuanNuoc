import React from 'react';
import RevenueList from '@/src/features/system_admin/revenue/component/RevenueList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function BillingPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Gói dịch vụ & Thanh toán</h1>
                <p className="text-gray-500 text-sm">Quản lý doanh thu, giao dịch và lịch sử thanh toán của đối tác.</p>
            </div>
            <RevenueList />
        </FadeIn>
    );
}
