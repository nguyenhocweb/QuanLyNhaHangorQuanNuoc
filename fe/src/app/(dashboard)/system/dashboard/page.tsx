import React from 'react';
import Dashboard_Stats_component from '@/src/features/system_admin/dashboard/dashboard/dashboard_component/dashBoard_stats_component';

export default function SystemAdminDashboardPage() {
    return (
        <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Tổng quan Hệ thống</h1>
                <p className="text-gray-500 text-sm">Giám sát các chỉ số kinh doanh, quản lý thương hiệu và tài khoản người dùng.</p>
            </div>
            
            <Dashboard_Stats_component />
        </div>
    );
}
