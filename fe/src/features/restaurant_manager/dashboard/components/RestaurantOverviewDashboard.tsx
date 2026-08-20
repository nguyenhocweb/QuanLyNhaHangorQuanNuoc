"use client";
import React, { useState } from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRestaurantReport } from '../../report/hook/useGetRestaurantReport';
import { useGetOrders } from '@/src/features/quan_ly_nha_hang/orders/hook/useGetOrders';
import { useGetRestaurantReviews } from '../../reviews/hook/useGetRestaurantReviews';
import { FiDollarSign, FiShoppingCart, FiClock, FiCheckCircle, FiStar } from 'react-icons/fi';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RestaurantOverviewDashboard = () => {
    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id;

    // Report Date Range (Last 7 days)
    const [dateRange] = useState(() => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 6);
        
        const toYMD = (d: Date) => {
            const offset = d.getTimezoneOffset();
            const local = new Date(d.getTime() - (offset*60*1000));
            return local.toISOString().split('T')[0];
        }
        return { start: toYMD(lastWeek), end: toYMD(today), today: toYMD(today) };
    });

    // 1. Fetch 7-day Report
    const { data: reportData, isLoading: isLoadingReport } = useGetRestaurantReport(restaurantId, dateRange.start, dateRange.end);
    
    // Extract today's stats from report
    const dailyRevenue = reportData?.metadata?.dailyRevenue || [];
    const todayStats = dailyRevenue.find((d: any) => d.date === dateRange.today) || { revenue: 0, orders: 0, cost: 0 };

    // 2. Fetch Recent Orders (Limit 5)
    const { data: ordersData, isLoading: isLoadingOrders } = useGetOrders(restaurantId as string, 1, 5);
    const recentOrders = ordersData?.metadata?.orders || [];

    // 3. Fetch Recent Reviews (Limit 5)
    const { data: reviewsData, isLoading: isLoadingReviews } = useGetRestaurantReviews(restaurantId, { page: 1, limit: 5 });
    const recentReviews = reviewsData?.metadata?.reviews || [];

    return (
        <FadeIn delay={0.1} className="w-full flex flex-col gap-6">
            
            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Doanh Thu Hôm Nay" 
                    value={isLoadingReport ? '...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(todayStats.revenue)} 
                    icon={<FiDollarSign />} 
                    color="text-emerald-600" 
                    bg="bg-emerald-100" 
                />
                <StatCard 
                    title="Đơn Hàng Hôm Nay" 
                    value={isLoadingReport ? '...' : todayStats.orders} 
                    icon={<FiShoppingCart />} 
                    color="text-blue-600" 
                    bg="bg-blue-100" 
                />
                <StatCard 
                    title="Đơn Mới" 
                    value={isLoadingOrders ? '...' : recentOrders.filter((o: any) => o.status === 'PENDING').length} 
                    icon={<FiClock />} 
                    color="text-orange-500" 
                    bg="bg-orange-100" 
                />
                <StatCard 
                    title="Tổng Lợi Nhuận (7 ngày)" 
                    value={isLoadingReport ? '...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(reportData?.metadata?.overview?.totalProfit || 0)} 
                    icon={<FiCheckCircle />} 
                    color="text-indigo-600" 
                    bg="bg-indigo-100" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 7-DAY MINI CHART */}
                <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[350px]">
                    <H className="text-lg font-bold text-gray-900 mb-4">Hoạt Động 7 Ngày Qua</H>
                    <div className="flex-1 w-full relative">
                        {isLoadingReport ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevMini" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorCostMini" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                                    <Tooltip formatter={(value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))} />
                                    <Area type="monotone" dataKey="revenue" name="Doanh Thu" stroke="#10b981" fillOpacity={1} fill="url(#colorRevMini)" />
                                    <Area type="monotone" dataKey="cost" name="Chi Phí" stroke="#ef4444" fillOpacity={1} fill="url(#colorCostMini)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* RECENT ORDERS */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[350px]">
                    <H className="text-lg font-bold text-gray-900 mb-4">Đơn Hàng Gần Đây</H>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {isLoadingOrders ? (
                            <div className="flex justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : recentOrders.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {recentOrders.map((order: any) => (
                                    <div key={order.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">#{order.orderNumber || order.id.slice(-6).toUpperCase()}</div>
                                            <div className="text-xs text-gray-500">{order.table?.name || 'Mang đi'}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-emerald-600 text-sm">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-8">Chưa có đơn hàng nào.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* RECENT REVIEWS SECTION (Full Width) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm w-full">
                <H className="text-lg font-bold text-gray-900 mb-4">Đánh giá mới nhất (5)</H>
                {isLoadingReviews ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                ) : recentReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {recentReviews.map((review: any) => (
                            <div key={review.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-indigo-50/30 transition-colors flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{review.user?.name || review.customer?.fullName || 'Khách hàng'}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-amber-400 mb-2 text-sm shrink-0">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={i < (review.overall_rating || review.rating) ? "fill-amber-400" : "text-gray-300"} />
                                    ))}
                                </div>
                                <P className="text-sm text-gray-700 italic flex-1 overflow-hidden text-ellipsis line-clamp-3">"{review.comment}"</P>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-sm py-8">Chưa có đánh giá nào gần đây.</div>
                )}
            </div>
        </FadeIn>
    );
};

const StatCard = ({ title, value, icon, color, bg }: { title: string, value: string | number, icon: React.ReactNode, color: string, bg: string }) => (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <P className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">{title}</P>
            <H className="text-xl font-bold text-gray-900">{value}</H>
        </div>
    </div>
);

export default RestaurantOverviewDashboard;
