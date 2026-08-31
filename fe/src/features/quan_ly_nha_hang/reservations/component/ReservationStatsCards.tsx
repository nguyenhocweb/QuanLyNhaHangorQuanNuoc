import React from 'react';
import { ReservationStats } from '../type/reservation.type';
import { BsCalendar2Check, BsClockHistory, BsPeople, BsCalendarEvent } from 'react-icons/bs';

interface ReservationStatsCardsProps {
    stats?: ReservationStats;
    activeTab: string;
    onSelectTab: (tab: string) => void;
}

export const ReservationStatsCards: React.FC<ReservationStatsCardsProps> = ({ stats, activeTab, onSelectTab }) => {
    const pendingCount = stats?.pending || 0;
    const todayCount = stats?.today || 0;
    const seatedCount = stats?.seated || 0;
    const upcomingCount = stats?.upcoming || 0;

    const cards = [
        {
            id: 'PENDING',
            title: 'Cần Duyệt Ngay',
            count: pendingCount,
            subtitle: 'Đơn mới chờ xác nhận',
            icon: <BsClockHistory className="text-2xl" />,
            badge: pendingCount > 0 ? `${pendingCount} mới` : undefined,
            color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-900',
            iconBg: 'bg-amber-500 text-white shadow-amber-200',
            ringColor: 'ring-amber-500'
        },
        {
            id: 'TODAY',
            title: 'Khách Hôm Nay',
            count: todayCount,
            subtitle: 'Lịch phục vụ trong ngày',
            icon: <BsCalendar2Check className="text-2xl" />,
            badge: 'Hôm nay',
            color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-900',
            iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
            ringColor: 'ring-emerald-500'
        },
        {
            id: 'TODAY_SEATED',
            title: 'Đang Dùng Bữa',
            count: seatedCount,
            subtitle: 'Bàn đang có khách ngồi',
            icon: <BsPeople className="text-2xl" />,
            color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-900',
            iconBg: 'bg-blue-600 text-white shadow-blue-200',
            ringColor: 'ring-blue-500'
        },
        {
            id: 'UPCOMING',
            title: 'Đặt Trước Tương Lai',
            count: upcomingCount,
            subtitle: 'Đơn từ ngày mai trở đi',
            icon: <BsCalendarEvent className="text-2xl" />,
            badge: 'Sắp tới',
            color: 'from-purple-500/10 to-violet-500/10 border-purple-200 text-purple-900',
            iconBg: 'bg-purple-600 text-white shadow-purple-200',
            ringColor: 'ring-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {cards.map((card) => {
                const isActive = activeTab === card.id || (card.id === 'TODAY_SEATED' && activeTab === 'TODAY');
                return (
                    <div
                        key={card.id}
                        onClick={() => {
                            if (card.id === 'TODAY_SEATED') {
                                onSelectTab('TODAY');
                            } else {
                                onSelectTab(card.id);
                            }
                        }}
                        className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                            isActive ? `ring-2 ${card.ringColor} border-transparent bg-gradient-to-br ${card.color}` : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.title}</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{card.count}</h3>
                            </div>
                            <div className={`p-3 rounded-xl shadow-sm ${card.iconBg}`}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100/80">
                            <span className="text-xs text-gray-500 font-medium">{card.subtitle}</span>
                            {card.badge && (
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    card.id === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {card.badge}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
