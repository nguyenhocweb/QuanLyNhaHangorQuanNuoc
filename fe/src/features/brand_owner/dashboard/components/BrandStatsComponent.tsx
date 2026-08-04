import React from 'react';
import { Div, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { FiUsers, FiTrendingUp, FiStar, FiMapPin } from 'react-icons/fi';

const stats = [
    { label: 'Tổng doanh thu tháng', value: '450.000.000đ', icon: <FiTrendingUp />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Số chi nhánh', value: '5', icon: <FiMapPin />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Tổng nhân viên', value: '42', icon: <FiUsers />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Đánh giá trung bình', value: '4.8/5', icon: <FiStar />, color: 'text-amber-500', bg: 'bg-amber-100' },
];

const BrandStatsComponent = () => {
    return (
        <FadeIn delay={0.1} className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
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
