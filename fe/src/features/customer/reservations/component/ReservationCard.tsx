import React from 'react';
import { CustomerReservation } from '../type/reservation.type';
import { FiClock, FiUsers, FiMapPin, FiPhoneCall } from 'react-icons/fi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';

interface Props {
    reservation: CustomerReservation;
    onCancelClick: (reservation: CustomerReservation) => void;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'PENDING': return { text: 'Đang xử lý', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
        case 'CONFIRMED': return { text: 'Đã xác nhận', color: 'bg-blue-50 text-blue-700 border-blue-200' };
        case 'SEATED': return { text: 'Đang dùng bữa', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
        case 'COMPLETED': return { text: 'Đã hoàn thành', color: 'bg-green-50 text-green-700 border-green-200' };
        case 'CANCELLED': return { text: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200' };
        case 'NO_SHOW': return { text: 'Không đến', color: 'bg-gray-100 text-gray-700 border-gray-300' };
        default: return { text: status, color: 'bg-gray-50 text-gray-700' };
    }
};

export const ReservationCard = ({ reservation, onCancelClick }: Props) => {
    const statusConfig = getStatusConfig(reservation.status);
    
    // Kiểm tra xem có thể hủy không (Nếu PENDING/CONFIRMED và thời gian còn lại lớn hơn cancellation_hours)
    const canCancel = ['PENDING', 'CONFIRMED'].includes(reservation.status);
    let isTooLateToCancel = false;
    
    if (canCancel && reservation.restaurant?.cancellation_hours) {
        const dateObj = new Date(reservation.reservation_date);
        const [hours, minutes] = reservation.start_time.split(':');
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const now = new Date();
        const diffInHours = (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < reservation.restaurant.cancellation_hours) {
            isTooLateToCancel = true;
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                        {reservation.restaurant?.logo ? (
                            <img src={reservation.restaurant.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <MdOutlineRestaurantMenu className="text-xl text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1" title={reservation.restaurant?.name || 'Nhà hàng'}>
                            {reservation.restaurant?.name || 'Nhà hàng (Đã xóa)'}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">#{reservation.confirmation_code}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border shrink-0 ${statusConfig.color}`}>
                    {statusConfig.text}
                </span>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="shrink-0 text-gray-400" />
                    <span><strong className="text-gray-900">{reservation.start_time}</strong>, {new Date(reservation.reservation_date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUsers className="shrink-0 text-gray-400" />
                    <span><strong className="text-gray-900">{reservation.party_size}</strong> khách</span>
                </div>
                {reservation.restaurant?.address?.street && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FiMapPin className="shrink-0 text-gray-400 mt-1" />
                        <span className="line-clamp-2">
                            {reservation.restaurant.address.street}, {reservation.restaurant.address.district}, {reservation.restaurant.address.city}
                        </span>
                    </div>
                )}
                {reservation.deposit_paid && (
                    <div className="inline-block mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                        ✓ Đã thanh toán cọc: {reservation.deposit_amount?.toLocaleString('vi-VN')}đ
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                <button className="flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                    Chi tiết
                </button>
                {canCancel && (
                    <button 
                        onClick={() => onCancelClick(reservation)}
                        disabled={isTooLateToCancel}
                        title={isTooLateToCancel ? `Không thể hủy do đã quá hạn mức ${reservation.restaurant?.cancellation_hours} tiếng trước giờ nhận bàn` : 'Hủy đặt bàn'}
                        className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Hủy bàn
                    </button>
                )}
            </div>
        </div>
    );
};
