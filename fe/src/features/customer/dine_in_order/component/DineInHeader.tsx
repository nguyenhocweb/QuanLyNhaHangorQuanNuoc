import React from 'react';
import Link from 'next/link';
import { MdArrowBack, MdTableRestaurant, MdRestaurantMenu, MdReceiptLong } from 'react-icons/md';
import { ReservationDetailData } from '../type/dine_in_order.type';

interface Props {
    reservation?: ReservationDetailData;
    activeTab: 'MENU' | 'TRACKER';
    orderedCount: number;
    cartCount: number;
    onTabChange: (tab: 'MENU' | 'TRACKER') => void;
}

export const DineInHeader: React.FC<Props> = ({
    reservation,
    activeTab,
    orderedCount,
    onTabChange
}) => {
    const tableData = reservation?.reservation_tables?.[0]?.table;

    return (
        <div className="bg-white border-b border-gray-100 shadow-xs">
            <div className="max-w-5xl mx-auto px-4 py-4">
                {/* Top Row: Back & Restaurant Info */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/user/reservations"
                            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 shrink-0 transition-colors"
                            title="Quay lại lịch sử đặt bàn"
                        >
                            <MdArrowBack className="text-xl" />
                        </Link>

                        <div className="min-w-0 flex items-center gap-2.5">
                            {reservation?.restaurant?.logo && (
                                <img
                                    src={reservation.restaurant.logo}
                                    alt="Restaurant logo"
                                    className="w-9 h-9 rounded-xl object-contain border border-gray-100 bg-gray-50 p-1 shrink-0"
                                />
                            )}
                            <div className="min-w-0">
                                <h1 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                                    {reservation?.restaurant?.name || 'Thực đơn gọi món tại bàn'}
                                </h1>
                                <p className="text-xs text-gray-500 truncate">
                                    {[
                                        reservation?.restaurant?.address?.street,
                                        reservation?.restaurant?.address?.district,
                                        reservation?.restaurant?.address?.city
                                    ].filter(Boolean).join(', ') || 'Gọi món trực tuyến'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table Badge */}
                    <div className="shrink-0 flex items-center gap-2">
                        {tableData ? (
                            <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-indigo-700">
                                <MdTableRestaurant className="text-base" />
                                <span className="text-xs font-bold">Bàn {tableData.table_number}</span>
                                {tableData.area?.name && (
                                    <span className="text-[10px] text-indigo-500 font-medium">({tableData.area.name})</span>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-gray-700 text-xs font-medium">
                                #{reservation?.confirmation_code || 'Bàn dùng bữa'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs Switcher */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                    <button
                        type="button"
                        onClick={() => onTabChange('MENU')}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'MENU'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <MdRestaurantMenu className="text-base" /> Thực đơn gọi món
                    </button>

                    <button
                        type="button"
                        onClick={() => onTabChange('TRACKER')}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'TRACKER'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <MdReceiptLong className="text-base" /> Món đã gọi ({orderedCount})
                    </button>
                </div>
            </div>
        </div>
    );
};
