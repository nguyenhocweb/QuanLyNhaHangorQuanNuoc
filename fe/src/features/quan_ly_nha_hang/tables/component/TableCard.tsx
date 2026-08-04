import React from 'react';
import { TableType, TableOperationalStatus } from '../type/table.type';
import { MdOutlineTableRestaurant } from 'react-icons/md';
import { BsClock, BsCurrencyDollar } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';

interface TableCardProps {
    table: TableType;
    onClick: (table: TableType) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onClick }) => {
    
    const getStatusStyles = () => {
        switch (table.operational_status) {
            case TableOperationalStatus.AVAILABLE:
                return 'bg-white border-gray-200 hover:border-green-400 hover:shadow-green-100/50';
            case TableOperationalStatus.IN_USE:
                return 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:shadow-indigo-100/50';
            case TableOperationalStatus.RESERVED:
                return 'bg-amber-50 border-amber-200 text-amber-700 hover:shadow-amber-100/50';
            case TableOperationalStatus.CLEANING:
                return 'bg-gray-100 border-gray-300 text-gray-600 hover:shadow-gray-200/50';
            case TableOperationalStatus.MAINTENANCE:
                return 'bg-red-50 border-red-200 text-red-600 opacity-70 cursor-not-allowed';
            case TableOperationalStatus.HOLDING:
                return 'bg-orange-50 border-orange-400 text-orange-600 hover:shadow-orange-100/50 animate-pulse'; // Pulse effect for holding
            default:
                return 'bg-white border-gray-200';
        }
    };

    const getStatusText = () => {
        switch (table.operational_status) {
            case TableOperationalStatus.AVAILABLE: return 'Trống';
            case TableOperationalStatus.IN_USE: return 'Đang phục vụ';
            case TableOperationalStatus.RESERVED: return 'Đã đặt trước';
            case TableOperationalStatus.CLEANING: return 'Chờ dọn dẹp';
            case TableOperationalStatus.MAINTENANCE: return 'Bảo trì';
            case TableOperationalStatus.HOLDING: return 'Đang giữ chỗ';
        }
    };

    return (
        <div 
            onClick={() => table.operational_status !== TableOperationalStatus.MAINTENANCE && table.operational_status !== TableOperationalStatus.HOLDING && onClick(table)}
            className={`
                relative flex flex-col p-4 rounded-2xl border transition-all duration-200 shadow-sm
                cursor-pointer hover:-translate-y-0.5 hover:shadow-md
                ${getStatusStyles()}
            `}
        >
            {/* Header: Table Number & Status Indicator */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <MdOutlineTableRestaurant className="text-2xl" />
                    <span className="font-bold text-lg">{table.table_number}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${table.operational_status === TableOperationalStatus.AVAILABLE ? 'bg-green-100 text-green-700' : 'bg-white/60'}
                `}>
                    {getStatusText()}
                </div>
            </div>

            {/* Body: Info */}
            <div className="flex-1">
                {table.operational_status === TableOperationalStatus.AVAILABLE && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                        <FiUsers /> Sức chứa: {table.min_capacity} - {table.max_capacity}
                    </div>
                )}
                
                {table.operational_status === TableOperationalStatus.IN_USE && (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                            <BsCurrencyDollar /> 
                            {table.current_order_total?.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="flex items-center gap-1.5 text-xs opacity-80">
                            <BsClock /> {table.time_seated || 'Vừa vào'}
                        </div>
                    </div>
                )}

                {table.operational_status === TableOperationalStatus.RESERVED && (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold truncate" title={table.guest_name}>
                            <FiUsers /> {table.guest_name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs opacity-80">
                            <BsClock /> Tới lúc {table.time_seated}
                        </div>
                    </div>
                )}
                
                {table.operational_status === TableOperationalStatus.HOLDING && (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold truncate text-orange-600">
                            <BsClock className="animate-spin-slow" /> Đang chọn
                        </div>
                    </div>
                )}
            </div>

            {/* VIP Badge */}
            {table.is_vip && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white">
                    VIP
                </div>
            )}
        </div>
    );
};
