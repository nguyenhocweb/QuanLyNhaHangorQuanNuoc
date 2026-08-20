"use client"
import React, { useState } from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { useGetSuppliers } from '../hooks/useGetSuppliers'
import { useCreateSupplier } from '../hooks/useCreateSupplier'
import { useUpdateSupplier } from '../hooks/useUpdateSupplier'
import { useDeleteSupplier } from '../hooks/useDeleteSupplier'
import { SupplierForm } from './SupplierForm'
import { Supplier } from '../types/supplier.type'
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal'
import FadeIn from '@/src/core/components/animation/FadeIn'

export const SuppliersTab = () => {
  const { activeWorkspace } = useAuthStore()
  const brandId = activeWorkspace?.id
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading } = useGetSuppliers(brandId, currentPage, itemsPerPage)
  const { mutate: createSupplier, isPending: isCreating } = useCreateSupplier()
  const { mutate: updateSupplier, isPending: isUpdating } = useUpdateSupplier()
  const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Supplier | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const paginatedData = data?.metadata || [];
  const totalPages = data?.options?.totalPages || 1;
  const totalCount = data?.options?.totalCount || 0;

  const handleOpenCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: Supplier) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSubmit = (formData: any) => {
    if (!brandId) return
    if (editingItem) {
      updateSupplier({ brandId, supplierId: editingItem.id, data: formData }, {
        onSuccess: () => setIsModalOpen(false)
      })
    } else {
      createSupplier({ brandId, data: formData }, {
        onSuccess: () => setIsModalOpen(false)
      })
    }
  }

  const handleDelete = () => {
    if (!brandId || !deletingId) return
    deleteSupplier({ brandId, supplierId: deletingId }, {
      onSuccess: () => setDeletingId(null)
    })
  }

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        <Div vitri="row_between" className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <H variant="text_black" className="text-lg font-semibold">Danh sách Nhà cung cấp</H>
          <Button variant="green" sizea="p4_2" onClick={handleOpenCreate} className="gap-2 shrink-0">
            <FaPlus /> Thêm mới
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
                    <th className="p-4 font-semibold text-gray-700">Nhà cung cấp</th>
                    <th className="p-4 font-semibold text-gray-700">Liên hệ</th>
                    <th className="p-4 font-semibold text-gray-700">Địa chỉ</th>
                    <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
                    <th className="p-4 font-semibold text-gray-700 w-28 text-center whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? paginatedData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-sm text-gray-500">MST: {item.taxCode || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.contact ? (
                          <div className="flex flex-col gap-1 text-sm">
                            {item.contact.contactName && <span className="font-medium text-gray-800"><span className="text-gray-500 font-normal">Người LH:</span> {item.contact.contactName}</span>}
                            {item.contact.phone && <span><span className="text-gray-500">SĐT:</span> {item.contact.phone}</span>}
                            {item.contact.email && <span><span className="text-gray-500">Email:</span> {item.contact.email}</span>}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {item.contact?.address || '-'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {item.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng'}
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-3">
                        <button onClick={() => handleOpenEdit(item)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Sửa">
                          <FaEdit size={18} />
                        </button>
                        <button onClick={() => setDeletingId(item.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Xóa">
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có nhà cung cấp nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {data?.metadata && data.metadata.length > 0 && (
              <div className="w-full flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, totalCount)} của {totalCount} kết quả
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    Hiển thị:
                    <select 
                      className="border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-blue-500"
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
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                    >
                      Trước
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
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
            <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative gap-4">
              <H className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
                {editingItem ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
              </H>
              <SupplierForm 
                initialData={editingItem || undefined}
                onSubmit={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                isPending={isCreating || isUpdating}
              />
            </Div>
          </Div>
        )}

        <ConfirmModal
          open={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          title="Xác nhận xóa"
          content="Bạn có chắc chắn muốn xóa nhà cung cấp này không? Hành động này không thể hoàn tác."
          confirmText={isDeleting ? "Đang xóa..." : "Xóa"}
          cancelText="Hủy"
        />
      </Div>
    </FadeIn>
  )
}
