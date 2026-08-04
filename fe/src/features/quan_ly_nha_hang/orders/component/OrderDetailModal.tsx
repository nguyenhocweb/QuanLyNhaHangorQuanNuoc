import React from 'react';
import { H, Button } from "@/src/core/components/ui";
import { FiX, FiClock, FiCheck } from "react-icons/fi";
import { Order } from "../type/order.type";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex flex-col gap-1">
            <H variant="text_black" className="text-xl font-bold text-gray-900 flex items-center gap-3">
              Chi tiết đơn hàng {order.order_number}
              <OrderStatusBadge status={order.status} />
            </H>
            <span className="text-sm text-gray-500">
              {order.table ? `Bàn: ${order.table.table_number}` : (order.isTakeaway ? 'Đơn mang đi' : '')} 
              {' • '} {new Date(order.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar p-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-semibold text-gray-600">Tên món</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Số lượng</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Đơn giá</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Thành tiền</th>
                <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Bếp</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.note && <div className="text-xs text-gray-500 italic">Ghi chú: {item.note}</div>}
                  </td>
                  <td className="py-4 text-center font-medium">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">{item.unitPrice.toLocaleString()} đ</td>
                  <td className="py-4 text-right font-medium text-gray-900">{item.totalPrice.toLocaleString()} đ</td>
                  <td className="py-4 text-center">
                    {item.status === 'SERVED' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        <FiCheck /> Lên đủ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                        <FiClock /> {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-6 rounded-b-3xl">
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">Tổng cộng</span>
            <span className="text-xl font-bold text-indigo-600">{order.total_amount.toLocaleString()} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
