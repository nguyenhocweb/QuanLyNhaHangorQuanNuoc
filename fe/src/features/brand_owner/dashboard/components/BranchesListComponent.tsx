"use client";
import React, { useState } from 'react';
import { Div, H, Button } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRevenueReport } from '../../report/hook/useGetRevenueReport';
import { FaCrown, FaStar } from 'react-icons/fa';

const BranchesListComponent = () => {
    const { activeWorkspace } = useAuthStore();
    const brandId = activeWorkspace?.id;
    
    // Mặc định 30 ngày
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
    const revenueByBranch = data?.metadata?.revenueByBranch || [];

    return (
        <FadeIn delay={0.3} className="w-full">
            <Div vitri="col_none" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
                <div className="flex justify-between items-center mb-6">
                    <H className="text-lg font-bold text-gray-900">Bảng Xếp Hạng Chi Nhánh (30 Ngày Qua)</H>
                    <Button variant="outline" sizea="p2_1" className="text-sm rounded-xl">Xem tất cả</Button>
                </div>
                
                <div className="w-full overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : revenueByBranch.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-xl w-16 text-center">Top</th>
                                    <th className="px-4 py-3">Tên Chi Nhánh</th>
                                    <th className="px-4 py-3 text-right">Doanh Thu</th>
                                    <th className="px-4 py-3 text-right">Lợi Nhuận Gộp</th>
                                    <th className="px-4 py-3 text-right rounded-tr-xl">Số Đơn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {revenueByBranch.slice(0, 5).map((branch: any, idx: number) => (
                                    <tr key={branch.restaurantId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4 text-center font-bold">
                                            {idx === 0 ? <FaCrown className="text-amber-500 text-xl mx-auto" /> : idx === 1 ? <FaStar className="text-slate-400 text-lg mx-auto" /> : idx === 2 ? <FaStar className="text-orange-400 text-lg mx-auto" /> : <span className="text-gray-400">#{idx + 1}</span>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-gray-900">{branch.name}</div>
                                        </td>
                                        <td className="px-4 py-4 text-right font-medium text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(branch.revenue)}
                                        </td>
                                        <td className="px-4 py-4 text-right font-medium text-emerald-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(branch.revenue - (branch.cost || 0))}
                                        </td>
                                        <td className="px-4 py-4 text-right text-gray-500">
                                            {branch.orders}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-8 text-gray-500">Chưa có dữ liệu bán hàng trong tháng.</div>
                    )}
                </div>
            </Div>
        </FadeIn>
    );
};

export default BranchesListComponent;
