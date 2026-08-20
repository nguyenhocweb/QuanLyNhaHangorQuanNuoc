"use client"
import React, { useState } from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { FaPlus, FaTrash, FaCheckCircle, FaSpinner, FaEye, FaTimes } from 'react-icons/fa'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { useGetPurchaseOrders } from '../hooks/useGetPurchaseOrders'
import { useCreatePurchaseOrder } from '../hooks/useCreatePurchaseOrder'
import { useUpdatePurchaseOrder } from '../hooks/useUpdatePurchaseOrder'
import { useDeletePurchaseOrder } from '../hooks/useDeletePurchaseOrder'
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants'
import { PurchaseOrderForm } from './PurchaseOrderForm'
import { PurchaseOrder } from '../types/purchase_order.type'
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal'
import FadeIn from '@/src/core/components/animation/FadeIn'
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary"
import { FiUploadCloud } from "react-icons/fi"
import { toast } from 'sonner'

export const PurchaseOrdersTab = () => {
  const { activeWorkspace } = useAuthStore()
  const brandId = activeWorkspace?.id
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading } = useGetPurchaseOrders(brandId, currentPage, itemsPerPage)
  const { data: restaurantsData } = useGetRestaurants(brandId!)
  const { mutate: createPurchaseOrder, isPending: isCreating } = useCreatePurchaseOrder()
  const { mutate: updatePurchaseOrder, isPending: isUpdating } = useUpdatePurchaseOrder()
  const { mutate: deletePurchaseOrder, isPending: isDeleting } = useDeletePurchaseOrder()

  const paginatedData = data?.metadata || [];
  const totalPages = data?.options?.totalPages || 1;
  const totalCount = data?.options?.totalCount || 0;

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [viewingPO, setViewingPO] = useState<any | null>(null)

  const { mutateAsync: uploadSingle } = useUpdateCloudinary()
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const closeViewingPO = () => {
    setViewingPO(null)
    setInvoiceFile(null)
    setInvoicePreview(null)
  }

  const handleOpenCreate = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = (formData: any) => {
    if (!brandId) return
    createPurchaseOrder({ brandId, data: formData }, {
      onSuccess: () => setIsModalOpen(false)
    })
  }

  const handleDelete = () => {
    if (!brandId || !deletingId) return
    deletePurchaseOrder({ brandId, poId: deletingId }, {
      onSuccess: () => setDeletingId(null)
    })
  }

  const handleApproveDraft = () => {
    if (!brandId || !approvingId) return
    updatePurchaseOrder({ brandId, poId: approvingId, data: { status: 'PENDING' } }, {
      onSuccess: () => setApprovingId(null)
    })
  }

  const handleCompletePO = async () => {
    if (!brandId || !viewingPO || !invoiceFile) {
      toast.error("Vui lòng tải lên chứng từ nhập kho!");
      return;
    }
    
    try {
      setIsUploading(true);
      const toastId = toast.loading("Đang tải ảnh hóa đơn...");
      const invoiceUrl = await uploadSingle({
        folder: `quan_ly_nha_hang/restaurants/${viewingPO.restaurantId}/invoice`,
        file: invoiceFile,
        public_idfe: `invoice_${Date.now()}`
      });
      toast.dismiss(toastId);
      
      updatePurchaseOrder({ brandId, poId: viewingPO.id, data: { status: 'COMPLETED', invoiceImageUrl: invoiceUrl } }, {
        onSuccess: () => {
          closeViewingPO();
        }
      });
    } catch (error) {
      toast.error("Lỗi khi upload ảnh hóa đơn");
    } finally {
      setIsUploading(false);
    }
  }

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceFile(file);
      setInvoicePreview(URL.createObjectURL(file));
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DRAFT': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">Nháp</span>;
      case 'PENDING': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">Đang chờ</span>;
      case 'PARTIAL': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700">Nhận một phần</span>;
      case 'COMPLETED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Hoàn tất</span>;
      case 'CANCELLED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Đã hủy</span>;
      default: return <span>{status}</span>;
    }
  }

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        <Div vitri="row_between" className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <H variant="text_black" className="text-lg font-semibold">Danh sách Đơn nhập hàng</H>
          <Button variant="green" sizea="p4_2" onClick={handleOpenCreate} className="gap-2 shrink-0">
            <FaPlus /> Lên đơn mới
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
                  <th className="p-4 font-semibold text-gray-700">Mã Đơn</th>
                  <th className="p-4 font-semibold text-gray-700">Ngày tạo</th>
                  <th className="p-4 font-semibold text-gray-700">Chi nhánh nhập</th>
                  <th className="p-4 font-semibold text-gray-700">Nhà cung cấp</th>
                  <th className="p-4 font-semibold text-gray-700">Chứng từ</th>
                  <th className="p-4 font-semibold text-gray-700">Tổng tiền</th>
                  <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
                  <th className="p-4 font-semibold text-gray-700 w-28 text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? paginatedData.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-blue-600">{item.poNumber}</td>
                    <td className="p-4 text-gray-600">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-medium text-indigo-700">{restaurantsData?.find((r: any) => r.id === item.restaurantId)?.name || 'Chi nhánh ảo'}</td>
                    <td className="p-4 font-medium text-gray-800">{item.supplier?.name || '-'}</td>
                    <td className="p-4 text-gray-600">
                      {item.invoiceImageUrl ? (
                        <a href={item.invoiceImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm">Xem HĐ</a>
                      ) : (
                        <span className="text-gray-400 text-sm">Không có</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-red-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-4 flex justify-center gap-3">
                      {item.status === 'DRAFT' && (
                        <>
                          <button onClick={() => setApprovingId(item.id)} className="text-green-500 hover:text-green-700 transition-colors" title="Duyệt đơn">
                            <FaCheckCircle size={18} />
                          </button>
                          <button onClick={() => setDeletingId(item.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Xóa nháp">
                            <FaTrash size={18} />
                          </button>
                        </>
                      )}
                      <button onClick={() => {
                        setViewingPO(item)
                        setInvoiceFile(null)
                        setInvoicePreview(null)
                      }} className="text-blue-500 hover:text-blue-700 transition-colors" title="Xem chi tiết">
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">Chưa có đơn nhập hàng nào</td>
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
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
              <H className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
                Tạo Đơn Nhập Hàng Mới
              </H>
              {brandId && (
                <PurchaseOrderForm 
                  brandId={brandId}
                  onSubmit={handleSubmit}
                  onClose={() => setIsModalOpen(false)}
                  isPending={isCreating}
                />
              )}
            </Div>
          </Div>
        )}

        {viewingPO && (
          <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={closeViewingPO}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
              
              <H className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 shrink-0">
                Chi tiết Đơn nhập hàng: <span className="text-blue-600">{viewingPO.poNumber}</span>
              </H>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 shrink-0">
                <div><span className="text-gray-500">Nhà cung cấp:</span> <span className="font-semibold text-gray-800">{viewingPO.supplier?.name || '-'}</span></div>
                <div><span className="text-gray-500">Chi nhánh nhập:</span> <span className="font-semibold text-indigo-700">{restaurantsData?.find((r: any) => r.id === viewingPO.restaurantId)?.name || 'Chi nhánh ảo'}</span></div>
                <div><span className="text-gray-500">Ngày tạo:</span> <span className="font-medium text-gray-800">{new Date(viewingPO.createdAt).toLocaleString('vi-VN')}</span></div>
                <div><span className="text-gray-500">Trạng thái:</span> {getStatusBadge(viewingPO.status)}</div>
                <div><span className="text-gray-500">Tổng tiền:</span> <span className="font-bold text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(viewingPO.totalAmount)}</span></div>
              </div>

              <H className="text-lg font-semibold text-gray-800 mt-2 mb-2 shrink-0">Danh sách hàng hóa nhập</H>
              <div className="overflow-x-auto border border-gray-200 rounded-xl shrink-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                      <th className="p-3 font-semibold text-gray-700">Mặt hàng</th>
                      <th className="p-3 font-semibold text-gray-700">Đơn vị</th>
                      <th className="p-3 font-semibold text-gray-700 text-right">SL Đặt</th>
                      <th className="p-3 font-semibold text-gray-700 text-right">SL Nhận</th>
                      <th className="p-3 font-semibold text-gray-700 text-right">Đơn giá</th>
                      <th className="p-3 font-semibold text-gray-700 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingPO.items && viewingPO.items.length > 0 ? viewingPO.items.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                        <td className="p-3 font-medium text-gray-800">{item.inventoryItem?.name || '-'}</td>
                        <td className="p-3 text-gray-600">{item.inventoryItem?.baseUnit || '-'}</td>
                        <td className="p-3 text-right text-gray-600">{item.orderQty}</td>
                        <td className="p-3 text-right font-medium text-blue-600">{item.receivedQty}</td>
                        <td className="p-3 text-right text-gray-600">{new Intl.NumberFormat('vi-VN').format(item.unitPrice)}</td>
                        <td className="p-3 text-right font-semibold text-gray-800">{new Intl.NumberFormat('vi-VN').format(item.actualAmount)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500 text-sm">Không có sản phẩm nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {viewingPO.status === 'PENDING' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col gap-3 shrink-0">
                  <H className="text-sm font-semibold text-blue-800">Cập nhật Chứng từ để Hoàn tất nhập kho</H>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 bg-white hover:bg-gray-50 border-dashed rounded-xl cursor-pointer overflow-hidden relative`}>
                    {invoicePreview ? (
                      <img src={invoicePreview} alt="Invoice" className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUploadCloud className="w-8 h-8 text-blue-400 mb-2" />
                        <p className="text-xs text-blue-600 font-medium">Tải ảnh chứng từ / Hóa đơn lên (*Bắt buộc)</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleInvoiceChange} />
                  </label>
                </div>
              )}

              <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-100 shrink-0">
                <Button variant="outline" sizea="p4_2" onClick={closeViewingPO} className="px-6" disabled={isUploading || isUpdating}>Đóng</Button>
                {viewingPO.status === 'PENDING' && (
                  <Button variant="green" sizea="p4_2" onClick={handleCompletePO} disabled={isUploading || isUpdating || !invoiceFile}>
                    {isUploading ? "Đang tải ảnh..." : isUpdating ? "Đang xử lý..." : "Hoàn tất nhập kho"}
                  </Button>
                )}
              </div>
            </div>
          </Div>
        )}

        <ConfirmModal
          open={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          title="Xác nhận xóa"
          content="Bạn có chắc chắn muốn xóa đơn nháp này không? Hành động này không thể hoàn tác."
          confirmText={isDeleting ? "Đang xóa..." : "Xóa"}
          cancelText="Hủy"
        />

        <ConfirmModal
          open={!!approvingId}
          onClose={() => setApprovingId(null)}
          onConfirm={handleApproveDraft}
          title="Xác nhận duyệt đơn"
          content="Bạn có chắc chắn muốn duyệt đơn nháp này? Đơn sẽ chuyển sang trạng thái Đang chờ (PENDING) để chờ nhập kho."
          confirmText={isUpdating ? "Đang xử lý..." : "Duyệt"}
          cancelText="Hủy"
        />
      </Div>
    </FadeIn>
  )
}
