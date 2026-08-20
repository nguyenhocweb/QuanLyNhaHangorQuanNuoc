import React from 'react';
import { BrandRevenueDashboard } from '@/src/features/brand_owner/report/components/BrandRevenueDashboard';
import { H, P } from "@/src/core/components/ui";

export const metadata = {
    title: 'Báo cáo Doanh thu | Quản lý Nhà Hàng',
    description: 'Thống kê và báo cáo doanh thu dành cho Chủ thương hiệu',
};

const ReportsPage = () => {
    return (
        <div className="w-full flex flex-col gap-6">
            <BrandRevenueDashboard />
        </div>
    );
};

export default ReportsPage;
