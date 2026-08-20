"use client";
import React, { useState } from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRevenueReport } from '../../report/hook/useGetRevenueReport';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BrandChartComponent = () => {
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
    const dailyRevenue = data?.metadata?.dailyRevenue || [];

    return (
        <FadeIn delay={0.2} className="w-full">
            <Div vitri="col_none" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <H className="text-lg font-bold text-gray-900">Doanh thu & Chi phí 30 ngày qua</H>
                </div>
                
                <div className="flex-1 w-full h-full pb-4">
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} tick={{fontSize: 12}} stroke="#94a3b8" />
                                <Tooltip formatter={(value: any, name: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value)), name === 'Doanh Thu' || name === 'revenue' ? 'Doanh thu' : 'Chi phí']} />
                                <Area type="monotone" dataKey="revenue" name="Doanh Thu" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="cost" name="Chi Phí" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Div>
        </FadeIn>
    );
};

export default BrandChartComponent;
