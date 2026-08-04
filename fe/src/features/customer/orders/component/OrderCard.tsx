import React from 'react';
import { CustomerOrderType } from '../type/order.type';
import Image from 'next/image';
import { BsBagCheck, BsClockHistory, BsReceiptCutoff } from 'react-icons/bs';
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

interface OrderCardProps {
    order: CustomerOrderType;
    onViewDetails: (order: CustomerOrderType) => void;
}

export const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'SENT_TO_KITCHEN':
            case 'PARTIALLY_SERVED':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'SERVED':
            case 'BILL_REQUESTED':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PAID':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'OPEN': return 'Đang gọi món';
            case 'SENT_TO_KITCHEN': return 'Đang chế biến';
            case 'PARTIALLY_SERVED': return 'Lên món 1 phần';
            case 'SERVED': return 'Đã lên đủ món';
            case 'BILL_REQUESTED': return 'Chờ thanh toán';
            case 'PAID': return 'Đã thanh toán';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        {order.restaurant?.logo ? (
                            <Image src={order.restaurant.logo} alt="Logo" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <BsBagCheck className="text-xl" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{order.restaurant?.name || 'Nhà hàng không xác định'}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">#{order.order_number}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                </span>
            </div>

            {/* Body - Món ăn */}
            <div className="flex-1 flex flex-col gap-2 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <BsReceiptCutoff className="text-gray-400" />
                    Chi tiết món ({order._count?.items || 0})
                </h4>
                
                {order.items && order.items.length > 0 ? (
                    <div className="flex flex-col gap-1.5 mt-1">
                        {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-sm">
                                <span className="text-gray-600 line-clamp-1 flex-1 pr-2">
                                    <span className="font-medium text-gray-800">{item.quantity}x</span> {item.name}
                                </span>
                                <span className="text-gray-800 font-medium whitespace-nowrap">{formatCurrency(item.totalPrice)}</span>
                            </div>
                        ))}
                        {(order._count?.items || 0) > 3 && (
                            <div className="text-xs text-indigo-600 font-medium mt-1 cursor-pointer hover:underline" onClick={() => onViewDetails(order)}>
                                + Xem thêm {(order._count?.items || 0) - 3} món khác
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic mt-1">Chưa có thông tin món ăn.</p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Tổng thanh toán</span>
                    <span className="font-bold text-lg text-indigo-600">{formatCurrency(order.total_amount)}</span>
                </div>
                
                <button 
                    onClick={() => onViewDetails(order)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-200 rounded-xl text-sm font-semibold"
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};
