"use client"
import React, { useState } from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { FaPlus, FaTrash, FaCheckCircle, FaTruck, FaEye, FaTimes } from 'react-icons/fa'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { useGetStockTransfers, useCreateStockTransfer, useUpdateStockTransfer, useDeleteStockTransfer } from '../hooks/useStockTransfer'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import { StockTransferForm } from './StockTransferForm'
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal'
import FadeIn from '@/src/core/components/animation/FadeIn'

export const StockTransfersTab = () => {
  const { activeWorkspace } = useAuthStore()
  const brandId = activeWorkspace?.id
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data, isLoading } = useGetStockTransfers(brandId, currentPage, itemsPerPage)

  const paginatedData = data?.metadata || [];
  const totalPages = data?.options?.totalPages || 1;
  const totalCount = data?.options?.totalCount || 0;
  const { data: restaurantsData } = useGetRestaurants(brandId!)
  
  const { mutate: createTransfer, isPending: isCreating } = useCreateStockTransfer()
  const { mutate: updateTransfer, isPending: isUpdating } = useUpdateStockTransfer()
  const { mutate: deleteTransfer, isPending: isDeleting } = useDeleteStockTransfer()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [shippingId, setShippingId] = useState<string | null>(null)
  const [completingTransfer, setCompletingTransfer] = useState<any | null>(null)
  const [viewingTransfer, setViewingTransfer] = useState<any | null>(null)

  const [receivedQtys, setReceivedQtys] = useState<Record<string, number>>({})

  const handleCreate = (formData: any) => {
    if (!brandId) return
    createTransfer({ brandId, data: formData }, {
      onSuccess: () => setIsModalOpen(false)
    })
  }

  const handleDelete = () => {
    if (!brandId || !deletingId) return
    deleteTransfer({ brandId, id: deletingId }, {
      onSuccess: () => setDeletingId(null)
    })
  }

  const handleShip = () => {
    if (!brandId || !shippingId) return
    updateTransfer({ brandId, id: shippingId, data: { status: 'IN_TRANSIT' } }, {
      onSuccess: () => setShippingId(null)
    })
  }

  const handleComplete = () => {
    if (!brandId || !completingTransfer) return
    const receivedItems = completingTransfer.items.map((item: any) => ({
      id: item.id,
      inventoryItemId: item.inventoryItemId,
      receivedQty: receivedQtys[item.id] !== undefined ? receivedQtys[item.id] : item.transferQty
    }))

    updateTransfer({ brandId, id: completingTransfer.id, data: { status: 'COMPLETED', receivedItems } }, {
      onSuccess: () => setCompletingTransfer(null)
    })
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DRAFT': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">Nháp</span>;
      case 'IN_TRANSIT': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">Đang giao</span>;
      case 'COMPLETED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Đã nhận</span>;
      case 'CANCELLED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Đã hủy</span>;
      default: return <span>{status}</span>;
    }
  }

  const getRestaurantName = (id: string) => {
    return restaurantsData?.find((r: any) => r.id === id)?.name || 'Kho Ảo'
  }

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        <Div vitri="row_between" className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <H variant="text_black" className="text-lg font-semibold">Quản lý Luân chuyển kho</H>
          <Button variant="green" sizea="p4_2" onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
            <FaPlus /> Lập phiếu chuyển
          </Button>
        </Div>

        {isLoading ? (
          <Div className="w-full p-8 justify-center">Đang tải...</Div>
        ) : (
          <Div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Mã Phiếu</th>
                  <th className="p-4 font-semibold text-gray-700">Ngày tạo</th>
                  <th className="p-4 font-semibold text-gray-700">Từ Kho (Xuất)</th>
                  <th className="p-4 font-semibold text-gray-700">Đến Kho (Nhận)</th>
                  <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
                  <th className="p-4 font-semibold text-gray-700 w-28 text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? paginatedData.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-blue-600">{item.transferNumber}</td>
                    <td className="p-4 text-gray-600">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-medium text-orange-600">{getRestaurantName(item.fromRestaurantId)}</td>
                    <td className="p-4 font-medium text-indigo-600">{getRestaurantName(item.toRestaurantId)}</td>
                    <td className="p-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-4 flex justify-center gap-3">
                      {item.status === 'DRAFT' && (
                        <>
                          <button onClick={() => setShippingId(item.id)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Xác nhận xuất hàng">
                            <FaTruck size={18} />
                          </button>
                          <button onClick={() => setDeletingId(item.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Xóa nháp">
                            <FaTrash size={18} />
                          </button>
                        </>
                      )}
                      {item.status === 'IN_TRANSIT' && (
                        <button onClick={() => {
                          setCompletingTransfer(item);
                          const qtys: any = {};
                          item.items.forEach((i: any) => qtys[i.id] = i.transferQty);
                          setReceivedQtys(qtys);
                        }} className="text-green-500 hover:text-green-700 transition-colors" title="Xác nhận nhận hàng">
                          <FaCheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => setViewingTransfer(item)} className="text-gray-500 hover:text-gray-700 transition-colors" title="Xem chi tiết">
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có phiếu luân chuyển nào</td>
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

        {isModalOpen && (
          <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl relative gap-4">
              <H className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
                Lập Phiếu Chuyển Kho
              </H>
              {brandId && (
                <StockTransferForm 
                  brandId={brandId}
                  onSubmit={handleCreate}
                  onClose={() => setIsModalOpen(false)}
                  isPending={isCreating}
                />
              )}
            </Div>
          </Div>
        )}

        {/* Modal Hoàn tất (Kiểm đếm nhận hàng) */}
        {completingTransfer && (
          <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl relative gap-4 max-h-[90vh] overflow-y-auto">
              <H className="w-full text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
                Kiểm đếm Nhận hàng: <span className="text-blue-600">{completingTransfer.transferNumber}</span>
              </H>
              <div className="w-full bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-2">
                Kho nhận: <b>{getRestaurantName(completingTransfer.toRestaurantId)}</b>. Vui lòng kiểm tra thực tế số lượng nhập kho.
              </div>
              
              <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                      <th className="p-3 font-semibold text-gray-700">Mặt hàng</th>
                      <th className="p-3 font-semibold text-gray-700 text-center">SL Xuất đi</th>
                      <th className="p-3 font-semibold text-gray-700 text-center w-32">SL Thực nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completingTransfer.items.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                        <td className="p-3 font-medium text-gray-800">{item.inventoryItem?.name} ({item.inventoryItem?.baseUnit})</td>
                        <td className="p-3 text-center text-gray-600">{item.transferQty}</td>
                        <td className="p-3 text-center">
                          <input 
                            type="number" 
                            step="any" 
                            min="0"
                            value={receivedQtys[item.id] !== undefined ? receivedQtys[item.id] : item.transferQty}
                            onChange={e => setReceivedQtys({...receivedQtys, [item.id]: parseFloat(e.target.value) || 0})}
                            className="w-full px-2 py-1 text-center text-sm rounded border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" sizea="p4_2" onClick={() => setCompletingTransfer(null)}>Hủy</Button>
                <Button variant="green" sizea="p4_2" onClick={handleComplete} disabled={isUpdating}>{isUpdating ? 'Đang xử lý...' : 'Xác nhận Nhập đủ'}</Button>
              </div>
            </Div>
          </Div>
        )}

        {/* Modal Xem chi tiết */}
        {viewingTransfer && (
          <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl relative gap-4 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setViewingTransfer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes size={20} />
              </button>
              
              <H className="w-full text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
                Chi tiết Phiếu Luân Chuyển: <span className="text-blue-600">{viewingTransfer.transferNumber}</span>
              </H>
              
              <div className="w-full grid grid-cols-2 gap-4 mb-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div><span className="text-gray-500">Từ kho (Xuất):</span> <span className="font-semibold text-orange-600">{getRestaurantName(viewingTransfer.fromRestaurantId)}</span></div>
                <div><span className="text-gray-500">Đến kho (Nhận):</span> <span className="font-semibold text-indigo-600">{getRestaurantName(viewingTransfer.toRestaurantId)}</span></div>
                <div><span className="text-gray-500">Ngày tạo:</span> <span className="font-medium text-gray-800">{new Date(viewingTransfer.createdAt).toLocaleString('vi-VN')}</span></div>
                <div><span className="text-gray-500">Trạng thái:</span> {getStatusBadge(viewingTransfer.status)}</div>
                <div className="col-span-2"><span className="text-gray-500">Ghi chú:</span> <span className="text-gray-800">{viewingTransfer.notes || 'Không có'}</span></div>
              </div>

              <H className="w-full text-lg font-semibold text-gray-800 mt-2 mb-2">Danh sách hàng hóa</H>
              <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                      <th className="p-3 font-semibold text-gray-700">Mặt hàng</th>
                      <th className="p-3 font-semibold text-gray-700 w-24 text-center">Đơn vị</th>
                      <th className="p-3 font-semibold text-gray-700 w-28 text-right">SL Xuất đi</th>
                      <th className="p-3 font-semibold text-gray-700 w-28 text-right">SL Thực nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingTransfer.items?.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                        <td className="p-3 font-medium text-gray-800">{item.inventoryItem?.name || '-'}</td>
                        <td className="p-3 text-gray-600 text-center">{item.inventoryItem?.baseUnit || '-'}</td>
                        <td className="p-3 text-right text-gray-600">{item.transferQty}</td>
                        <td className="p-3 text-right font-medium text-blue-600">{viewingTransfer.status === 'COMPLETED' ? item.receivedQty : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full flex justify-end mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" sizea="p4_2" onClick={() => setViewingTransfer(null)} className="px-6">Đóng</Button>
              </div>
            </Div>
          </Div>
        )}

        <ConfirmModal
          open={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          title="Xác nhận xóa"
          content="Bạn có chắc chắn muốn xóa phiếu nháp này không?"
          confirmText={isDeleting ? "Đang xóa..." : "Xóa"}
          cancelText="Hủy"
        />

        <ConfirmModal
          open={!!shippingId}
          onClose={() => setShippingId(null)}
          onConfirm={handleShip}
          title="Xác nhận Xuất hàng"
          content="Hành động này sẽ trừ tồn kho của Kho Xuất và chuyển trạng thái phiếu sang Đang giao. Bạn có chắc chắn hàng đã được bốc lên xe?"
          confirmText={isUpdating ? "Đang xử lý..." : "Đã xuất hàng"}
          cancelText="Hủy"
        />
      </Div>
    </FadeIn>
  )
}
