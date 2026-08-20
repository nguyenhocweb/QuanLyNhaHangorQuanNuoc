"use client";

import React, { useState } from 'react';
import { Div, H, Button, Input } from "@/src/core/components/ui";
import { FiSearch, FiEye } from "react-icons/fi";
import useDebounce from "@/src/core/hooks/useDebounce";
import { useGetOrders } from "../hook/useGetOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderDetailModal } from "./OrderDetailModal";
import { Order } from "../type/order.type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useRealtimeUpdates } from "@/src/core/hooks/useRealtimeUpdates";

export default function RestaurantOrderList({ restaurantId }: { restaurantId: string }) {
  // Lắng nghe socket event để cập nhật realtime
  useRealtimeUpdates(restaurantId);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce({ value: searchInput, delay: 500 });
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const {
    orders,
    isLoading,
    setSearchTerm,
    statusFilter, setStatusFilter,
    page, limit, meta,
    handlePageChange, setLimit
  } = useGetOrders(restaurantId);

  // Sync search input với react query
  React.useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  return (
    <Div className="w-full font-sans" vitri="col_none">
      <FadeIn className="w-full">
        <Div variant="bg_white" shape="square" className="w-full flex-col gap-6 p-6 rounded-2xl border border-gray-100 shadow-sm">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <div>
              <H variant="text_black" className="text-xl font-bold">Danh sách Đơn hàng</H>
              <p className="text-sm text-gray-500">Quản lý và theo dõi trạng thái đơn hàng của nhà hàng</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-[250px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm mã đơn hàng..." 
                  className="pl-10 w-full h-[42px] rounded-xl bg-gray-50 border-gray-200 text-[14px]" 
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[42px] px-3 rounded-xl border border-gray-200 bg-white text-[14px] outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="OPEN">Đang gọi món</option>
                <option value="SENT_TO_KITCHEN">Đã gửi bếp</option>
                <option value="PARTIALLY_SERVED">Đã ra 1 phần</option>
                <option value="SERVED">Đã lên đủ món</option>
                <option value="BILL_REQUESTED">Chờ thanh toán</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 rounded-tl-xl">Mã đơn</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Bàn / Loại</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Tổng tiền</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Thời gian</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center rounded-tr-xl">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">Không tìm thấy đơn hàng nào</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-indigo-600">{order.order_number}</td>
                      <td className="py-3 px-4 font-medium">
                        {order.table?.table_number || (order.isTakeaway ? 'Mang đi' : 'N/A')}
                      </td>
                      <td className="py-3 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {order.total_amount.toLocaleString()} đ
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 flex flex-col gap-1">
                        <div>
                          <span className="font-medium text-gray-700">Tạo:</span> {new Date(order.createdAt).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric'})}
                        </div>
                        {order.status === "PAID" && order.paid_at && (
                          <div className="text-green-600">
                            <span className="font-medium">Thanh toán:</span> {new Date(order.paid_at).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric'})}
                          </div>
                        )}
                        {order.status === "CANCELLED" && (
                          <div className="text-red-500">
                            <span className="font-medium">Đã hủy:</span> {order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric'}) : ''}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="outline" 
                            sizea="p2_1" 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50"
                            title="Xem chi tiết"
                          >
                            <FiEye />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </Div>
      </FadeIn>

      {selectedOrderDetails && (
        <OrderDetailModal 
          order={selectedOrderDetails} 
          onClose={() => setSelectedOrderDetails(null)} 
        />
      )}
    </Div>
  );
}
