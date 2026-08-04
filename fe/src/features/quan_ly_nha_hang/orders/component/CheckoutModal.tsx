import React from 'react';
import { H, P, Button } from "@/src/core/components/ui";
import { FiX, FiPrinter, FiCheckCircle, FiLoader } from "react-icons/fi";
import { Order } from "../type/order.type";
import { useUpdateOrder } from "../hook/useUpdateOrder";

interface CheckoutModalProps {
  order: Order;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ order, onClose }) => {
  const { mutate: updateOrder, isPending } = useUpdateOrder(order.restaurantId);

  const handleCheckout = () => {
    // Tạm thời hardcode systemPaymentMethodId cho test (Tiền mặt)
    updateOrder({
      id: order.id,
      payload: {
        status: "PAID",
        systemPaymentMethodId: "65b2a1c0d4f3e2a1b0c9d999" // ID giả cho Tiền mặt
      }
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 p-6">
        
        <div className="flex justify-between items-center mb-6">
          <H variant="text_black" className="text-xl font-bold text-gray-900">Thanh toán đơn hàng</H>
          <button onClick={onClose} disabled={isPending} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Mã đơn:</span>
            <span className="font-semibold">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Bàn:</span>
            <span className="font-semibold">{order.table?.table_number || (order.isTakeaway ? 'Mang đi' : 'N/A')}</span>
          </div>
          <div className="w-full border-t border-dashed border-gray-300 my-2"></div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tạm tính:</span>
            <span>{order.subtotal.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Thuế/Phí:</span>
            <span>{order.tax_amount.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Giảm giá:</span>
            <span>- {order.discount_amount.toLocaleString()} đ</span>
          </div>
          <div className="w-full border-t border-gray-300 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-gray-800">Tổng cộng:</span>
            <span className="font-bold text-xl text-indigo-600">{order.total_amount.toLocaleString()} đ</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button 
            variant="default" 
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            {isPending && <FiLoader className="animate-spin" />}
            {isPending ? 'Đang xử lý...' : <><FiCheckCircle /> Xác nhận Đã Thu Tiền</>}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {}}
            disabled={isPending}
            className="w-full py-3 rounded-xl border-gray-200 text-gray-600 bg-white hover:bg-gray-50 font-semibold flex items-center justify-center gap-2"
          >
            <FiPrinter /> In tạm tính
          </Button>
        </div>

      </div>
    </div>
  );
};
