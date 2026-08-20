"use client"
import React, { useState } from 'react';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRevenueReport } from '../hook/useGetRevenueReport';
import { Div, H } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FaChartLine, FaChartPie, FaMoneyBillWave, FaShoppingCart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

export const BrandRevenueDashboard = () => {
  const { activeWorkspace } = useAuthStore();
  const brandId = activeWorkspace?.id;
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    // Add 7 hours for GMT+7 if needed, but since it's just local client time, let's use standard timezone offset
    // to format YYYY-MM-DD correctly according to user's local timezone.
    const toYMD = (d: Date) => {
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - (offset*60*1000));
        return local.toISOString().split('T')[0];
    }
    
    return { start: toYMD(lastMonth), end: toYMD(today) };
  });

  const { data, isLoading, error } = useGetRevenueReport(brandId, dateRange.start, dateRange.end);

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

  const { overview, dailyRevenue, revenueByBranch, topSellingItems } = data.metadata;

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 w-full pb-8">
        {/* Header & Filters */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <H className="text-xl font-bold text-slate-800">Báo cáo Tổng hợp Thương hiệu</H>
            <p className="text-sm text-slate-500 mt-1">Cái nhìn vĩ mô về sức khỏe tài chính toàn hệ thống</p>
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

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Tổng Doanh Thu" 
            value={overview?.totalRevenue || 0} 
            icon={<FaMoneyBillWave className="text-blue-500" />} 
            isCurrency 
          />
          <MetricCard 
            title="Chi Phí Nhập Kho (COGS)" 
            value={overview?.totalCost || 0} 
            icon={<FaChartLine className="text-orange-500" />} 
            isCurrency 
          />
          <MetricCard 
            title="Lợi Nhuận Gộp (Ước tính)" 
            value={overview?.totalProfit || 0} 
            icon={<FaChartPie className="text-emerald-500" />} 
            isCurrency 
          />
          <MetricCard 
            title="Tổng Đơn Hàng" 
            value={overview?.totalOrders || 0} 
            icon={<FaShoppingCart className="text-purple-500" />} 
            isCurrency={false} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <H className="text-lg font-bold text-slate-800 mb-4">Biểu đồ Tăng trưởng Doanh thu vs Chi phí</H>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} tick={{fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Doanh Thu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="cost" name="Chi Phí" stroke="#f97316" fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <H className="text-lg font-bold text-slate-800 mb-4">Tỷ trọng Doanh thu Chi nhánh</H>
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              {revenueByBranch?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByBranch}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="revenue"
                      nameKey="restaurantName"
                    >
                      {revenueByBranch.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm">Chưa có dữ liệu chi nhánh</p>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <H className="text-lg font-bold text-slate-800 mb-4">Bảng Xếp Hạng Chi Nhánh (Leaderboard)</H>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-sm">
                  <th className="p-3 font-semibold text-slate-700 rounded-tl-lg">Chi nhánh</th>
                  <th className="p-3 font-semibold text-slate-700 text-right">Doanh thu</th>
                  <th className="p-3 font-semibold text-slate-700 text-right">Chi phí (COGS)</th>
                  <th className="p-3 font-semibold text-slate-700 text-right">Lợi nhuận gộp</th>
                  <th className="p-3 font-semibold text-slate-700 text-right rounded-tr-lg">Đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                {revenueByBranch?.map((branch: any, idx: number) => (
                  <tr key={branch.restaurantId} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-800 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                        {idx + 1}
                      </span>
                      {branch.restaurantName}
                    </td>
                    <td className="p-3 text-right font-medium text-blue-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(branch.revenue)}
                    </td>
                    <td className="p-3 text-right text-orange-500">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(branch.cost)}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(branch.profit)}
                    </td>
                    <td className="p-3 text-right text-slate-600">{branch.orders}</td>
                  </tr>
                ))}
                {(!revenueByBranch || revenueByBranch.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">Không có dữ liệu chi nhánh</td>
                  </tr>
                )}
              </tbody>
            </table>
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
