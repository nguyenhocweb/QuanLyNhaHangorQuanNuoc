import React from 'react';
import ReportDashboard from '@/src/features/brand_owner/reports/component/ReportDashboard';
import { H, P } from "@/src/core/components/ui";

export const metadata = {
    title: 'Báo cáo Doanh thu | Quản lý Nhà Hàng',
    description: 'Thống kê và báo cáo doanh thu dành cho Chủ thương hiệu',
};

const ReportsPage = () => {
    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header Block */}
            <div className="w-full flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <H className="text-2xl font-bold text-gray-800">Báo cáo Doanh thu</H>
                    <P className="text-gray-500 mt-1">
                        Theo dõi hiệu suất kinh doanh, số lượng đơn hàng và top món bán chạy của tất cả các chi nhánh.
                    </P>
                </div>
            </div>

            {/* Content Block */}
            <ReportDashboard />
        </div>
    );
};

export default ReportsPage;
