'use client';

import React, { useState } from 'react';
import { useGetReport } from '../hook/useGetReport';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import StatCards from './StatCards';
import RevenueChart from './RevenueChart';
import BranchRevenueTable from './BranchRevenueTable';
import TopSellingItems from './TopSellingItems';
import FadeIn from '@/src/core/components/animation/FadeIn';

const ReportDashboard = () => {
    const { user } = useAuthStore();
    const brandId = user?.brand?.[0]?.id || "";

    // Default to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);

    const { data, isLoading, isError } = useGetReport(brandId, { startDate, endDate });

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="w-full p-4 bg-red-50 text-red-600 rounded-xl">
                Có lỗi xảy ra khi tải báo cáo. Vui lòng thử lại sau.
            </div>
        );
    }

    return (
        <FadeIn className="w-full space-y-6">
            {/* Filter Bar */}
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-end gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-medium">Từ ngày:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-medium">Đến ngày:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Stat Cards */}
            <StatCards overview={data.overview} />

            {/* Main Chart */}
            <RevenueChart data={data.dailyRevenue} />

            {/* Bottom Grid: Branches & Top Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <BranchRevenueTable data={data.revenueByBranch} totalRevenue={data.overview.totalRevenue} />
                <TopSellingItems data={data.topSellingItems} />
            </div>
        </FadeIn>
    );
};

export default ReportDashboard;
