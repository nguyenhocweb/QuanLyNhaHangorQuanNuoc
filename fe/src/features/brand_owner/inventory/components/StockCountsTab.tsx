"use client"
import React, { useState } from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { FaEye, FaListAlt } from 'react-icons/fa'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { useGetStockCounts, useApproveStockCount, useRejectStockCount } from '../hooks/useStockCount'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import { StockCountDetailModal } from './StockCountDetailModal'
import { StockCount } from '../types/stock_count.type'
import FadeIn from '@/src/core/components/animation/FadeIn'

export const StockCountsTab = () => {
  const { activeWorkspace } = useAuthStore()
  const brandId = activeWorkspace?.id
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { data: restaurantsData } = useGetRestaurants(brandId)
  const { data, isLoading } = useGetStockCounts(brandId, selectedRestaurantId || undefined, currentPage, itemsPerPage)

  const paginatedData = data?.metadata || [];
  const totalPages = data?.options?.totalPages || 1;
  const totalCount = data?.options?.totalCount || 0;
  
  const [viewingId, setViewingId] = useState<string | null>(null)

  const { mutate: approveStockCount, isPending: isApproving } = useApproveStockCount()
  const { mutate: rejectStockCount, isPending: isRejecting } = useRejectStockCount()

  const handleApprove = (id: string, reason: string) => {
    if (!brandId) return
    approveStockCount({ brandId, id, reason }, {
      onSuccess: () => setViewingId(null)
    })
  }

  const handleReject = (id: string, reason: string) => {
    if (!brandId) return
    rejectStockCount({ brandId, id, reason }, {
      onSuccess: () => setViewingId(null)
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">Bản nháp</span>;
      case "PENDING_APPROVAL":
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Chờ duyệt</span>;
      case "APPROVED":
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Đã duyệt</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Hoàn tất</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">Đã từ chối</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        <Div vitri="row_between" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 gap-4">
          <Div vitri="row_start" className="gap-4 flex-1">
            <h3 className="text-lg font-bold text-gray-800 shrink-0 flex items-center gap-2">
              <FaListAlt className="text-blue-500" /> Danh sách Phiếu Kiểm Kho
            </h3>
            <select 
              value={selectedRestaurantId}
              onChange={(e) => {
                setSelectedRestaurantId(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm w-64 max-w-full"
            >
              <option value="">Tất cả chi nhánh</option>
              {restaurantsData?.map((res: any) => (
                <option key={res.id} value={res.id}>{res.name}</option>
              ))}
            </select>
          </Div>
          
        </Div>

        {isLoading ? (
          <Div className="w-full p-8 justify-center">Đang tải...</Div>
        ) : (
          <Div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl w-[20%]">Mã Phiếu</th>
                  <th className="px-4 py-3 w-[25%]">Chi nhánh</th>
                  <th className="px-4 py-3 w-[15%]">Ngày tạo</th>
                  <th className="px-4 py-3 w-[15%]">Ghi chú</th>
                  <th className="px-4 py-3 w-[15%]">Trạng thái</th>
                  <th className="px-4 py-3 text-right rounded-tr-xl w-[10%]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? paginatedData.map((item: StockCount) => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.code || item.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {restaurantsData?.find((r: any) => r.id === item.restaurantId)?.name || 'Chi nhánh không xác định'}
                    </td>
                    <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate" title={item.notes || ''}>{item.notes || '-'}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="white" 
                          sizea="p4_2" 
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 px-2"
                          onClick={() => setViewingId(item.id)} 
                          title="Xem chi tiết"
                        >
                          <FaEye size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có phiếu kiểm kho nào</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>

            {/* Pagination Controls */}
            {paginatedData.length > 0 && (
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

        {viewingId && brandId && (
          <StockCountDetailModal
            brandId={brandId}
            stockCountId={viewingId}
            onClose={() => setViewingId(null)}
            onApprove={(reason) => handleApprove(viewingId, reason)}
            onReject={(reason) => handleReject(viewingId, reason)}
            isPending={isApproving || isRejecting}
          />
        )}
      </Div>
    </FadeIn>
  )
}
