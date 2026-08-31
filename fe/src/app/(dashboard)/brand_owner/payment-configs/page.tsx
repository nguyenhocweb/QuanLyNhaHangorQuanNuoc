'use client';

import React from 'react';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { BrandPaymentConfigDashboard } from '@/src/features/brand_owner/payment_configs/component/BrandPaymentConfigDashboard';
import { Div } from '@/src/core/components/ui';

export default function BrandPaymentConfigsPage() {
    const { activeWorkspace, user } = useAuthStore();
    const brandId = user?.brand?.find((b: any) => b?.isSelect || b?.isSlect)?.id || user?.brand?.[0]?.id || activeWorkspace?.id || (user as any)?.brandId || (user as any)?.brand_id || '';

    if (!brandId) {
        return (
            <Div vitri="col_none" className="p-4 md:p-8" size="full">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
                    <p className="text-sm font-semibold">Vui lòng chọn không gian làm việc Thương hiệu để tiếp tục.</p>
                </div>
            </Div>
        );
    }

    return (
        <Div vitri="col_none" className="p-4 md:p-8" size="full">
            <BrandPaymentConfigDashboard brandId={brandId} />
        </Div>
    );
}
