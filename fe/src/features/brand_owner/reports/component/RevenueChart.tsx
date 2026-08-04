import React from 'react';
import { DailyRevenue } from '../type/report.type';
import { Div, H } from "@/src/core/components/ui";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: DailyRevenue[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    // Format date for display
    const formattedData = data.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }));

    return (
        <Div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full" vitri="col_none">
            <H className="text-lg font-bold text-gray-800 mb-6">Biểu đồ Doanh thu</H>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="displayDate" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }} 
                            dy={10} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)}
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value) || 0), 'Doanh thu']}
                            labelFormatter={(label) => `Ngày ${label}`}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#8b5cf6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                            activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Div>
    );
};

export default RevenueChart;
