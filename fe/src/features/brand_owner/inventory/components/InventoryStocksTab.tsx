"use client"
import React, { useState } from 'react'
import { Div, H } from '@/src/core/components/ui'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { useGetInventoryStocks } from '../hooks/useGetInventoryStocks'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import FadeIn from '@/src/core/components/animation/FadeIn'
import { FaExclamationTriangle } from 'react-icons/fa'

export const InventoryStocksTab = () => {
  const { activeWorkspace } = useAuthStore()
  const brandId = activeWorkspace?.id
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { data: restaurantsData } = useGetRestaurants(brandId as string)
  const { data: stocksData, isLoading } = useGetInventoryStocks(brandId, selectedRestaurantId || undefined, currentPage, itemsPerPage)

  const totalPages = stocksData?.options?.totalPages || 1;
  const totalCount = stocksData?.options?.totalCount || 0;

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        <Div vitri="row_between" className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <H variant="text_black" className="text-lg font-semibold">Báo cáo Tồn kho</H>
          
          <select 
            value={selectedRestaurantId}
            onChange={(e) => {
              setSelectedRestaurantId(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm w-64"
          >
            <option value="">Tất cả chi nhánh</option>
            {restaurantsData?.map((res: any) => (
              <option key={res.id} value={res.id}>{res.name}</option>
            ))}
          </select>
        </Div>

        {isLoading ? (
          <Div className="w-full p-8 justify-center">Đang tải dữ liệu tồn kho...</Div>
        ) : (
          <Div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Mặt hàng</th>
                  <th className="p-4 font-semibold text-gray-700">Tồn kho hiện tại</th>
                  <th className="p-4 font-semibold text-gray-700">Mức tối thiểu</th>
                  <th className="p-4 font-semibold text-gray-700">Đơn vị</th>
                  <th className="p-4 font-semibold text-gray-700">Vị trí (Chi nhánh)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let displayData = [];
                  if (stocksData?.metadata && stocksData.metadata.length > 0) {
                    if (!selectedRestaurantId) {
                      // Tất cả chi nhánh -> Cộng dồn theo inventoryItemId
                      const groupMap = new Map();
                      stocksData.metadata.forEach((item: any) => {
                        const itemId = item.inventoryItemId;
                        if (!groupMap.has(itemId)) {
                          groupMap.set(itemId, {
                            ...item,
                            location: 'Kho tổng hợp (Tất cả chi nhánh)',
                            minStockLevel: item.inventoryItem?.minStockLevel || 0
                          });
                        } else {
                          const existing = groupMap.get(itemId);
                          existing.quantity += item.quantity;
                        }
                      });
                      displayData = Array.from(groupMap.values());
                    } else {
                      // Một chi nhánh cụ thể -> Gắn tên chi nhánh vào vị trí
                      const selectedRes = restaurantsData?.find((r: any) => r.id === selectedRestaurantId);
                      const resName = selectedRes ? selectedRes.name : '';
                      displayData = stocksData.metadata.map((item: any) => ({
                        ...item,
                        location: resName,
                        minStockLevel: item.inventoryItem?.minStockLevel || 0
                      }));
                    }
                  }

                  if (displayData.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có dữ liệu tồn kho</td>
                      </tr>
                    );
                  }

                  return displayData.map((item: any) => {
                    const isLowStock = item.quantity <= item.minStockLevel;
                    return (
                      <tr key={item.id || item.inventoryItemId} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isLowStock ? 'bg-red-50/30' : ''}`}>
                        <td className="p-4 font-medium text-gray-800">{item.inventoryItem?.name || '-'}</td>
                        <td className="p-4 font-bold text-lg">
                          <span className={isLowStock ? "text-red-600 flex items-center gap-2" : "text-gray-800"}>
                            {item.quantity}
                            {isLowStock && <FaExclamationTriangle size={14} title="Sắp hết hàng" />}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{item.minStockLevel}</td>
                        <td className="p-4 text-gray-600">{item.inventoryItem?.baseUnit || '-'}</td>
                        <td className="p-4 text-gray-600">{item.location || '-'}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
            </div>

            {/* Pagination Controls */}
            {stocksData?.metadata && stocksData.metadata.length > 0 && (
              <div className="w-full flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, totalCount)} của {totalCount} kết quả
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    Hiển thị:
                    <select 
                      className="border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-blue-500 bg-white"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all bg-white"
                    >
                      Trước
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all bg-white"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Div>
        )}
      </Div>
    </FadeIn>
  )
}
