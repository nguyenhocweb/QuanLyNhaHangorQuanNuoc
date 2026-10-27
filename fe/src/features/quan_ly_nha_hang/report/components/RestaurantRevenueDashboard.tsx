"use client"
import React, { useState } from 'react';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRestaurantReport } from '../hook/useGetRestaurantReport';
import { H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FaChartLine, FaMoneyBillWave, FaShoppingCart, FaUtensils, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const RestaurantRevenueDashboard = () => {
  const { activeWorkspace } = useAuthStore();
  const restaurantId = activeWorkspace?.id;
  const [dateRange, setDateRange] = useState(() => {
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

  const { data, isLoading, error } = useGetRestaurantReport(restaurantId, dateRange.start, dateRange.end);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 text-center p-4">Có lỗi xảy ra khi tải báo cáo doanh thu.</div>;
  }

  const { overview, dailyRevenue, topSellingItems } = data.metadata;

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 w-full pb-8">
        {/* Header & Filters */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <H className="text-xl font-bold text-slate-800">Báo cáo Doanh thu Chi nhánh</H>
            <p className="text-sm text-slate-500 mt-1">Theo dõi hoạt động kinh doanh hàng ngày</p>
          </div>
          <div className="flex gap-3">
            <input 
              type="date" 
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <input 
              type="date" 
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        {/* Local Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Doanh Thu Gộp" 
            value={overview?.totalRevenue || 0} 
            icon={<FaMoneyBillWave className="text-blue-500" />} 
            isCurrency 
          />
          <MetricCard 
            title="Chi Phí Nguyên Liệu (COGS)" 
            value={overview?.totalCost || 0} 
            icon={<FaChartLine className="text-orange-500" />} 
            isCurrency 
          />
          <MetricCard 
            title="Lợi Nhuận Gộp (Ước tính)" 
            value={overview?.totalProfit || 0} 
            icon={<FaChartLine className="text-emerald-500" />} 
            isCurrency 
          />
          <MetricCard 
            title="Số Lượng Đơn" 
            value={overview?.totalOrders || 0} 
            icon={<FaShoppingCart className="text-purple-500" />} 
            isCurrency={false} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <H className="text-lg font-bold text-slate-800 mb-4">Biểu đồ Phân tích Doanh thu & Chi phí hàng ngày</H>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis yAxisId="left" tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} tick={{fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(val) => `${val} đơn`} tick={{fontSize: 12}} />
                  <Tooltip formatter={(value: any, name: any) => name === 'orders' ? [`${value} đơn`, 'Số đơn'] : [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value)), name === 'revenue' ? 'Doanh thu' : 'Chi phí']} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Doanh Thu" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="cost" name="Chi Phí" barSize={20} fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Số Đơn" stroke="#8b5cf6" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Sellers Table */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <FaUtensils className="text-red-500 text-sm" />
              </div>
              <H className="text-lg font-bold text-slate-800">Top 5 Món Bán Chạy</H>
            </div>
            <div className="flex-1 overflow-y-auto">
              {topSellingItems?.length > 0 ? (
                <ul className="space-y-4">
                  {topSellingItems.map((item: any, index: number) => (
                    <li key={item.menuItemId} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Đã bán: <span className="font-medium text-slate-700">{item.totalQuantity}</span></p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600 text-sm">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalRevenue)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Chưa có dữ liệu bán hàng</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </FadeIn>
  );
};

const MetricCard = ({ title, value, icon, isCurrency }: { title: string, value: number, icon: React.ReactNode, isCurrency: boolean }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">
          {isCurrency 
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
            : new Intl.NumberFormat('vi-VN').format(value)
          }
        </p>
      </div>
    </div>
  );
};
