import React, { useState } from "react";
import { useGetOrders } from "../../orders/hook/useGetOrders";
import { useCheckout } from "../hook/useCheckout";
import { toast } from "sonner";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaMoneyBillWave, FaCreditCard, FaWallet, FaCheck } from "react-icons/fa";

export const PosCashier = ({ restaurantId }: { restaurantId: string }) => {
  const { orders, isLoading } = useGetOrders(restaurantId);
  const { mutate: checkout, isPending } = useCheckout();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [surcharge, setSurcharge] = useState<number>(0);
  const [tip, setTip] = useState<number>(0);

  // Filter orders that are eligible for payment
  const payableOrders = orders.filter(
    (o: any) => o.status !== "PAID"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium whitespace-nowrap">Đang gọi món</span>;
      case "SENT_TO_KITCHEN": return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-lg font-medium whitespace-nowrap">Đang nấu</span>;
      case "PARTIALLY_SERVED": return <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium whitespace-nowrap">Lên 1 phần</span>;
      case "SERVED": return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium whitespace-nowrap">Đã lên đủ</span>;
      case "BILL_REQUESTED": return <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg font-bold whitespace-nowrap shadow-sm border border-red-200 animate-pulse">Tính tiền!</span>;
      case "CANCELLED": return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap">Đã hủy</span>;
      default: return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap">{status}</span>;
    }
  };

  const selectedOrder = payableOrders.find((o: any) => o.id === selectedOrderId);

  const totalRequired = selectedOrder 
    ? selectedOrder.total_amount + surcharge + tip 
    : 0;

  const handleNumpad = (num: string) => {
    if (num === "C") setPaymentAmount("");
    else if (num === "000") setPaymentAmount((prev) => prev + "000");
    else setPaymentAmount((prev) => prev + num);
  };

  const handleCheckout = () => {
    if (!selectedOrder) return;
    
    // Nếu là quét mã QR, mặc định khách chuyển đúng số tiền
    const amount = paymentMethod === "MOMO" ? totalRequired : Number(paymentAmount);
    
    if (!amount || amount < totalRequired) {
      toast.error(`Vui lòng nhập đủ số tiền ${totalRequired.toLocaleString()} đ`);
      return;
    }

    checkout({
      orderId: selectedOrder.id,
      payments: [{
        // In real app, you'd map "CASH" to a real systemPaymentMethodId
        // For demo, we just pass null and let backend ignore if optional, but validator requires string? Wait, demoValidator.chuoiKhongBatBuoc allows undefined!
        systemPaymentMethodId: undefined, 
        amount: amount
      }],
      surchargeAmount: surcharge,
      tipAmount: tip,
    }, {
      onSuccess: () => {
        setSelectedOrderId(null);
        setPaymentAmount("");
        setSurcharge(0);
        setTip(0);
      }
    });
  };

  return (
    <FadeIn>
      <div className="flex h-[calc(100vh-100px)] gap-6 w-full">
        {/* L/H: List of Orders */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng chờ thanh toán</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {isLoading ? (
              <p className="text-gray-500">Đang tải...</p>
            ) : payableOrders.length === 0 ? (
              <p className="text-gray-500">Không có đơn hàng nào.</p>
            ) : (
              payableOrders.map((order: any) => (
                <div 
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setPaymentAmount(order.total_amount.toString());
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedOrderId === order.id 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">#{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Bàn: {order.table?.name || "Mang đi"}</div>
                  <div className="font-bold text-indigo-600">{order.total_amount.toLocaleString()} đ</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* R/H: Cashier POS */}
        <div className="w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          {selectedOrder ? (
            <div className="flex gap-6 h-full">
              {/* Order Details */}
              <div className="w-1/2 flex flex-col border-r border-gray-100 pr-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Chi tiết hóa đơn</h2>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-gray-500">x{item.quantity}</div>
                      </div>
                      <div className="font-medium text-gray-800">{item.totalPrice.toLocaleString()} đ</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính:</span>
                    <span>{selectedOrder.subtotal.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thuế (VAT):</span>
                    <span>{(selectedOrder.tax_amount || 0).toLocaleString()} đ</span>
                  </div>
                  {(selectedOrder.surcharge_amount > 0) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí dịch vụ:</span>
                      <span>{selectedOrder.surcharge_amount.toLocaleString()} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giảm giá HĐ:</span>
                    <span>- {selectedOrder.discount_amount.toLocaleString()} đ</span>
                  </div>
                  {(selectedOrder.loyaltyDiscountAmount > 0) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 text-indigo-600 font-medium">Trừ điểm Loyalty:</span>
                      <span className="text-indigo-600 font-medium">- {selectedOrder.loyaltyDiscountAmount.toLocaleString()} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Phụ thu thêm:</span>
                    <input 
                      type="number" 
                      className="w-24 text-right border border-gray-200 rounded px-2 py-1 outline-none focus:border-indigo-500"
                      value={surcharge}
                      onChange={(e) => setSurcharge(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Tiền Tip:</span>
                    <input 
                      type="number" 
                      className="w-24 text-right border border-gray-200 rounded px-2 py-1 outline-none focus:border-indigo-500"
                      value={tip}
                      onChange={(e) => setTip(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold text-indigo-600 pt-2 border-t border-gray-200">
                    <span>Tổng cộng:</span>
                    <span>{totalRequired.toLocaleString()} đ</span>
                  </div>
                </div>
              </div>

              {/* Numpad & Payment */}
              <div className="w-1/2 flex flex-col pl-2">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Thanh toán</h2>
                
                {/* Method Select */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: "CASH", icon: <FaMoneyBillWave />, label: "Tiền mặt" },
                    { id: "CARD", icon: <FaCreditCard />, label: "Quẹt thẻ" },
                    { id: "MOMO", icon: <FaWallet />, label: "Momo/Zalo" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        paymentMethod === m.id
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {m.icon} <span className="font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Conditional Render: Numpad for Cash, QR for Momo/Transfer */}
                {paymentMethod === "MOMO" ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <p className="text-gray-500 mb-4 text-center">Yêu cầu khách hàng quét mã QR bên dưới để thanh toán chính xác <span className="font-bold text-indigo-600">{totalRequired.toLocaleString()} đ</span></p>
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                      <img 
                        src={`https://img.vietqr.io/image/970415-113366668888-compact2.jpg?amount=${totalRequired}&addInfo=Thanh toan don hang ${selectedOrder?.order_number}&accountName=NHA HANG`} 
                        alt="Mã QR Thanh Toán" 
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-4 text-center">Hệ thống sẽ tự động xác nhận khi nhận được tiền (Demo VietQR)</p>
                  </div>
                ) : (
                  <>
                    {/* Amount Display */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 text-right">
                      <div className="text-sm text-gray-500 mb-1">Khách đưa</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {paymentAmount ? Number(paymentAmount).toLocaleString() : "0"} đ
                      </div>
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-3 gap-3 flex-1 mb-4">
                      {["1","2","3","4","5","6","7","8","9","C","0","000"].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => handleNumpad(btn)}
                          className={`text-xl font-bold rounded-xl shadow-sm border transition-all hover:-translate-y-0.5 ${
                            btn === "C" 
                              ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100" 
                              : "bg-white text-gray-800 border-gray-200 hover:border-indigo-300"
                          }`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>

                    {/* Change Due */}
                    {Number(paymentAmount) > totalRequired && (
                      <div className="flex justify-between items-center text-orange-600 font-bold mb-4 px-2">
                        <span>Tiền thối lại:</span>
                        <span>{(Number(paymentAmount) - totalRequired).toLocaleString()} đ</span>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaCheck /> {isPending ? "Đang xử lý..." : "Hoàn tất thanh toán"}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Vui lòng chọn 1 đơn hàng để thanh toán
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};
