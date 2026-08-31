import React from 'react';
import { BsClockHistory, BsCalendar2Check, BsCalendarEvent, BsListUl } from 'react-icons/bs';

export type ReservationTabType = 'PENDING' | 'TODAY' | 'UPCOMING' | 'ALL';

interface ReservationTabsProps {
    activeTab: ReservationTabType;
    onChangeTab: (tab: ReservationTabType) => void;
    pendingCount: number;
    todayCount: number;
    upcomingCount: number;
}

export const ReservationTabs: React.FC<ReservationTabsProps> = ({
    activeTab,
    onChangeTab,
    pendingCount,
    todayCount,
    upcomingCount
}) => {
    const tabs: Array<{ id: ReservationTabType; label: string; icon: React.ReactNode; count?: number; badgeColor?: string }> = [
        {
            id: 'PENDING',
            label: 'Cần duyệt gấp',
            icon: <BsClockHistory className="text-base" />,
            count: pendingCount,
            badgeColor: 'bg-red-500 text-white animate-pulse'
        },
        {
            id: 'TODAY',
            label: 'Lịch hôm nay',
            icon: <BsCalendar2Check className="text-base" />,
            count: todayCount,
            badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            id: 'UPCOMING',
            label: 'Đặt trước sắp tới',
            icon: <BsCalendarEvent className="text-base" />,
            count: upcomingCount,
            badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
            id: 'ALL',
            label: 'Tất cả & Lịch sử',
            icon: <BsListUl className="text-base" />
        }
    ];

    return (
        <div className="flex flex-wrap gap-2 border-b border-gray-200/80 pb-px">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChangeTab(tab.id)}
                        className={`flex items-center gap-2.5 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all duration-200 border-b-2 relative ${
                            isActive
                                ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm'
                                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${tab.badgeColor}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
