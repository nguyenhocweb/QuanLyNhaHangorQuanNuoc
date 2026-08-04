"use client"
import FadeIn from "@/src/core/components/animation/FadeIn";
import Public_Stat_Card from "@/src/core/components/layout/public-stat-Card"
import { Div } from "@/src/core/components/ui"
import { FiGrid, FiUserPlus, FiUsers, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';
import { BiMoney } from 'react-icons/bi';
import { useDashboard_stat } from "../dashboard_hook/useDashboard_stas";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Image from "next/image";

const Dashboard_Stats_component = () => {
    const { data, isLoading } = useDashboard_stat();

    if (isLoading || !data) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải dữ liệu tổng quan...</div>;
    }

    const { stats, chartData, recentRequests } = data;

    // Helper: Định dạng tiền tệ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper: Badge trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1"><FiCheckCircle /> Đã duyệt</span>;
            case 'PENDING': return <span className="px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-700 flex items-center gap-1"><FiClock /> Đang chờ</span>;
            case 'REJECTED': return <span className="px-2.5 py-1 text-xs rounded-full bg-rose-100 text-rose-700 flex items-center gap-1"><FiXCircle /> Từ chối</span>;
            default: return <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <FadeIn>
        <div className="flex flex-col gap-6 w-full">
            {/* Hàng 1: Các thẻ KPI (Premium Design) */}
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" size="full">
                <Public_Stat_Card
                    index={1}
                    title="Tổng thương hiệu"
                    value={stats.totalBrands.value}
                    icon={<FiGrid />}
                    iconWrapperClass="bg-blue-50 text-blue-600"
                    trendValue={stats.totalBrands.trendPercentage}
                    trendLabel={stats.totalBrands.trendLabel}
                    trendType={stats.totalBrands.trendType}
                />
                <Public_Stat_Card
                    index={2}
                    title="Tổng Nhà hàng"
                    value={stats.totalRestaurants.value}
                    icon={<IoRestaurantOutline />}
                    iconWrapperClass="bg-indigo-50 text-indigo-500"
                    trendValue={stats.totalRestaurants.trendPercentage}
                    trendLabel={stats.totalRestaurants.trendLabel}
                    trendType={stats.totalRestaurants.trendType}
                />
                <Public_Stat_Card
                    index={3}
                    title="Tổng người dùng"
                    value={stats.totalUsers.value}
                    icon={<FiUsers />}
                    iconWrapperClass="bg-purple-50 text-purple-600"
                    trendValue={stats.totalUsers.trendPercentage}
                    trendLabel={stats.totalUsers.trendLabel}
                    trendType={stats.totalUsers.trendType}
                />
                <Public_Stat_Card
                    index={4}
                    title="Doanh thu dự kiến"
                    value={formatCurrency(stats.totalRevenue.value)}
                    icon={<BiMoney className="text-2xl" />}
                    iconWrapperClass="bg-emerald-50 text-emerald-500"
                    trendValue={stats.totalRevenue.trendPercentage}
                    trendLabel={stats.totalRevenue.trendLabel}
                    trendType={stats.totalRevenue.trendType}
                />
            </Div>

            {/* Hàng 2: Biểu đồ & Danh sách chờ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Biểu đồ */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">Tăng trưởng Người dùng, Thương hiệu & Nhà hàng</h3>
                        <p className="text-sm text-slate-500">Thống kê số lượng đăng ký trong 6 tháng gần nhất</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBrands" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRestaurants" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Area type="monotone" name="Người dùng" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" name="Thương hiệu" dataKey="brands" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBrands)" />
                                <Area type="monotone" name="Nhà hàng" dataKey="restaurants" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRestaurants)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cột phải: Yêu cầu gần đây */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">Yêu cầu nâng cấp mới</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Xem tất cả</button>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                        {recentRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                                <FiUserPlus className="text-3xl opacity-50" />
                                <p className="text-sm">Không có yêu cầu nào mới</p>
                            </div>
                        ) : (
                            recentRequests.map(req => (
                                <div key={req.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 relative">
                                        {req.user.avatar ? (
                                            <Image src={req.user.avatar} alt={req.user.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-sm">
                                                {req.user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{req.brandName}</p>
                                        <p className="text-xs text-slate-500 truncate">{req.user.email}</p>
                                        <p className="text-xs text-slate-400 mt-1">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {getStatusBadge(req.status)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
        </FadeIn>
    );
}

export default Dashboard_Stats_component;