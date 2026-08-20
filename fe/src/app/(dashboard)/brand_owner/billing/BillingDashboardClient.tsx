"use client";
import React from 'react';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { BillingDashboard } from '@/src/features/brand_owner/billing/component/BillingDashboard';

export default function BillingDashboardClient() {
    const { activeWorkspace } = useAuthStore();
    const brandId = activeWorkspace?.id;

    if (!brandId) {
        return <div className="p-8 text-center text-gray-500">Đang tải thông tin...</div>;
    }

    return <BillingDashboard brandId={brandId} />;
}
