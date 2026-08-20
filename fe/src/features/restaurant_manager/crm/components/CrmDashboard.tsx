import React from 'react';
import { useGetRestaurantCrmAnalytics, useGetBrandCrmAnalytics, useGetBrandLoyaltyTransactions } from '../hook/useGetCrmAnalytics';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FaUsers, FaCrown, FaMedal, FaStar } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CrmDashboardProps {
  level: 'restaurant' | 'brand';
  id: string; // restaurantId or brandId
}

const COLORS = {
  NEW: '#94a3b8', // slate-400
  MEMBER: '#3b82f6', // blue-500
  SILVER: '#94a3b8', // silver/slate
  GOLD: '#eab308', // yellow-500
  VIP: '#a855f7', // purple-500
};

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ level, id }) => {
  const { data: restData, isLoading: restLoading } = useGetRestaurantCrmAnalytics(level === 'restaurant' ? id : null);
  const { data: brandData, isLoading: brandLoading } = useGetBrandCrmAnalytics(level === 'brand' ? id : null);
  const { data: transactionsData } = useGetBrandLoyaltyTransactions(level === 'brand' ? id : null);

  const isLoading = level === 'restaurant' ? restLoading : brandLoading;
  const data = level === 'restaurant' ? restData : brandData;

  if (isLoading) {
    return (
      <Div className="w-full h-64 flex items-center justify-center">
        <P className="text-gray-500 animate-pulse">Đang tải dữ liệu CRM...</P>
      </Div>
    );
  }

  if (!data) {
    return (
      <Div className="w-full p-8 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <P className="text-gray-500">Không có dữ liệu khách hàng.</P>
      </Div>
    );
  }

  const chartData = [
    { name: 'Khách Mới (NEW)', value: data.tiers.NEW, color: COLORS.NEW },
    { name: 'Thành Viên (MEMBER)', value: data.tiers.MEMBER, color: COLORS.MEMBER },
    { name: 'Bạc (SILVER)', value: data.tiers.SILVER, color: COLORS.SILVER },
    { name: 'Vàng (GOLD)', value: data.tiers.GOLD, color: COLORS.GOLD },
    { name: 'VIP', value: data.tiers.VIP, color: COLORS.VIP },
  ].filter(item => item.value > 0);

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full" gap="g6">
        
        {/* Header */}
        <Div className="w-full justify-between items-center" shape="none">
          <Div vitri="col_none" shape="none" className="gap-1">
            <H variant="text_black" className="text-2xl font-bold">
              Phân tích Tệp Khách hàng (CRM)
            </H>
            <P className="text-gray-500 text-sm">
              Theo dõi tỷ lệ phân bố các hạng khách hàng của {level === 'brand' ? 'Thương hiệu' : 'Nhà hàng'}
            </P>
          </Div>
        </Div>

        {/* Stats Grid */}
        <Div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" shape="none">
          <StatCard title="Tổng Khách Hàng" value={data.totalCustomers} icon={<FaUsers className="text-blue-500 text-2xl" />} />
          <StatCard title="Khách Mới (NEW)" value={data.tiers.NEW} icon={<FaStar className="text-slate-400 text-2xl" />} />
          <StatCard title="Thành Viên (MEMBER)" value={data.tiers.MEMBER} icon={<FaUsers className="text-blue-500 text-2xl" />} />
          <StatCard title="Hạng Bạc (SILVER)" value={data.tiers.SILVER} icon={<FaMedal className="text-slate-400 text-2xl" />} />
          <StatCard title="Khách VIP" value={data.tiers.VIP + data.tiers.GOLD} icon={<FaCrown className="text-yellow-500 text-2xl" />} />
        </Div>

        {/* Chart Section */}
        <Div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6" shape="none">
          {/* Chart */}
          <Div vitri="col_none" className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100" shape="none">
            <H className="text-lg font-semibold text-gray-800 mb-6">Biểu đồ Cơ cấu Hạng Thành Viên</H>
            <div className="w-full h-[400px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} khách`, 'Số lượng']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Chưa có dữ liệu thống kê hạng thành viên
                </div>
              )}
            </div>
          </Div>

          {/* Details / Legend List */}
          <Div vitri="col_none" className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4" shape="none">
            <H className="text-lg font-semibold text-gray-800 mb-2">Chi tiết Tỷ lệ</H>
            {chartData.map((item, idx) => {
              const percentage = ((item.value / data.totalCustomers) * 100).toFixed(1);
              return (
                <Div key={idx} className="w-full justify-between items-center p-3 rounded-xl bg-gray-50/50" shape="none">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-semibold">{item.value}</span>
                    <span className="text-sm text-gray-400 w-12 text-right">{percentage}%</span>
                  </div>
                </Div>
              );
            })}
          </Div>
        </Div>

         {/* Customer List Table (Optional for Brand Owner) */}
         {level === 'brand' && data.customersList && (
            <Div vitri="col_none" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6" shape="none">
               <H className="text-lg font-semibold text-gray-800 mb-4">Danh sách Khách hàng Gần đây</H>
               <div className="w-full overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-gray-100">
                       <th className="py-3 px-4 text-gray-500 font-medium">Khách hàng</th>
                       <th className="py-3 px-4 text-gray-500 font-medium">SĐT</th>
                       <th className="py-3 px-4 text-gray-500 font-medium">Hạng</th>
                       <th className="py-3 px-4 text-gray-500 font-medium text-right">Tổng Chi (VNĐ)</th>
                       <th className="py-3 px-4 text-gray-500 font-medium text-right">Điểm thưởng</th>
                     </tr>
                   </thead>
                   <tbody>
                     {data.customersList.slice(0, 10).map((customer: any, idx: number) => (
                       <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                         <td className="py-3 px-4">
                           <div className="flex items-center gap-3">
                             <img src={customer.user?.avatar || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                             <span className="font-medium text-gray-700">{customer.user?.name || 'Khách vãng lai'}</span>
                           </div>
                         </td>
                         <td className="py-3 px-4 text-gray-600">{customer.user?.sdt || '---'}</td>
                         <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                              ${customer.tier === 'VIP' ? 'bg-purple-100 text-purple-700' :
                                customer.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'}
                            `}>
                              {customer.tier}
                            </span>
                         </td>
                         <td className="py-3 px-4 text-right font-medium text-gray-800">
                           {customer.totalSpent.toLocaleString('vi-VN')} đ
                         </td>
                         <td className="py-3 px-4 text-right font-medium text-blue-600">
                           {customer.loyaltyPoints} pt
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </Div>
         )}

         {/* Transactions / Fraud Warning Log */}
         {level === 'brand' && transactionsData && (
            <Div vitri="col_none" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6" shape="none">
               <H className="text-lg font-semibold text-gray-800 mb-4">Lịch sử Tích điểm & Cảnh báo Gian lận</H>
               <div className="w-full overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-gray-100">
                       <th className="py-3 px-4 text-gray-500 font-medium">Thời gian</th>
                       <th className="py-3 px-4 text-gray-500 font-medium">Mô tả</th>
                       <th className="py-3 px-4 text-gray-500 font-medium">Loại</th>
                       <th className="py-3 px-4 text-gray-500 font-medium text-right">Điểm</th>
                       <th className="py-3 px-4 text-gray-500 font-medium text-center">Cảnh báo</th>
                     </tr>
                   </thead>
                   <tbody>
                     {transactionsData.slice(0, 10).map((tx: any, idx: number) => (
                       <tr key={idx} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${tx.isSuspicious ? 'bg-red-50/30' : ''}`}>
                         <td className="py-3 px-4 text-gray-600">
                           {new Date(tx.createdAt).toLocaleString('vi-VN')}
                         </td>
                         <td className="py-3 px-4 text-gray-700">
                           {tx.description}
                         </td>
                         <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                              ${tx.type === 'EARN' ? 'bg-green-100 text-green-700' :
                                tx.type === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'}
                            `}>
                              {tx.type}
                            </span>
                         </td>
                         <td className={`py-3 px-4 text-right font-medium ${tx.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           {tx.points >= 0 ? '+' : ''}{tx.points} pt
                         </td>
                         <td className="py-3 px-4 text-center">
                           {tx.isSuspicious && (
                             <span className="inline-block px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                               ĐÁNG NGỜ
                             </span>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </Div>
         )}

      </Div>
    </FadeIn>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className="w-10 h-10 rounded-full bg-blue-50/50 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <span className="text-2xl font-bold text-gray-800">{value}</span>
  </div>
);
