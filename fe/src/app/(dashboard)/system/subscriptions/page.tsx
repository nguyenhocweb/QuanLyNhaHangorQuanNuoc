import React from 'react';
import { SubscriptionsList } from '@/src/features/system_admin/subscriptions/component/SubscriptionsList';
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function SubscriptionsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Gói cước</h1>
                <p className="text-gray-500 text-sm">Thiết lập và quản lý các gói đăng ký dịch vụ (Subscriptions).</p>
            </div>
            <SubscriptionsList />
        </FadeIn>
    );
}
