import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-600 ring-blue-500/20';
      case 'SENT_TO_KITCHEN':
        return 'bg-purple-50 text-purple-600 ring-purple-500/20';
      case 'PARTIALLY_SERVED':
        return 'bg-amber-50 text-amber-600 ring-amber-500/20';
      case 'SERVED':
        return 'bg-green-50 text-green-600 ring-green-500/20';
      case 'BILL_REQUESTED':
        return 'bg-orange-50 text-orange-600 ring-orange-500/20';
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'CANCELLED':
        return 'bg-red-50 text-red-600 ring-red-500/20';
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/20';
    }
  };

  const getBadgeText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Đang mở';
      case 'SENT_TO_KITCHEN': return 'Đã gửi bếp';
      case 'PARTIALLY_SERVED': return 'Đã ra 1 phần';
      case 'SERVED': return 'Đã lên đủ món';
      case 'BILL_REQUESTED': return 'Đang chờ tính tiền';
      case 'PAID': return 'Đã thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getBadgeStyle(status)}`}>
      {getBadgeText(status)}
    </span>
  );
};
