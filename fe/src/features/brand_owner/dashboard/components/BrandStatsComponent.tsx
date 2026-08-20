"use client";
import React, { useState } from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FiTrendingUp, FiMapPin, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRevenueReport } from '../../report/hook/useGetRevenueReport';

const BrandStatsComponent = () => {
    const { activeWorkspace } = useAuthStore();
    const brandId = activeWorkspace?.id;
    
    // Mặc định lấy tháng hiện tại (từ 1 tháng trước đến hôm nay) để phù hợp với hiển thị dashboard
    const [dateRange] = useState(() => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        
        const toYMD = (d: Date) => {
            const offset = d.getTimezoneOffset();
            const local = new Date(d.getTime() - (offset*60*1000));
            return local.toISOString().split('T')[0];
        }
        return { start: toYMD(lastMonth), end: toYMD(today) };
    });

    const { data, isLoading } = useGetRevenueReport(brandId, dateRange.start, dateRange.end);

    const overview = data?.metadata?.overview;
    const branchCount = data?.metadata?.revenueByBranch?.length || 0;

    const stats = [
        { label: 'Tổng doanh thu tháng', value: isLoading ? '...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview?.totalRevenue || 0), icon: <FiTrendingUp />, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Lợi nhuận gộp', value: isLoading ? '...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview?.totalProfit || 0), icon: <FiDollarSign />, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Tổng đơn hàng', value: isLoading ? '...' : overview?.totalOrders || 0, icon: <FiShoppingCart />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Số chi nhánh có GD', value: isLoading ? '...' : branchCount, icon: <FiMapPin />, color: 'text-amber-500', bg: 'bg-amber-100' },
    ];

    return (
        <FadeIn delay={0.1} className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${stat.bg} ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <div>
                        <P className="text-gray-500 text-sm">{stat.label}</P>
                        <H className="text-xl font-bold text-gray-900 mt-1">{stat.value}</H>
                    </div>
                </div>
            ))}
        </FadeIn>
    );
};

export default BrandStatsComponent;
