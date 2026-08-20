"use client"
import React, { useState } from 'react'
import { Div, H, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/core/components/ui'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { useGetInventoryItems } from '../hooks/useGetInventoryItems'
import { useCreateInventoryItem } from '../hooks/useCreateInventoryItem'
import { useUpdateInventoryItem } from '../hooks/useUpdateInventoryItem'
import { useDeleteInventoryItem } from '../hooks/useDeleteInventoryItem'
import { InventoryItemForm } from './InventoryItemForm'
import { InventoryItem } from '../types/inventory_item.type'
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal'
import FadeIn from '@/src/core/components/animation/FadeIn'

export const InventoryItemsTab = () => {
  const { activeWorkspace } = useAuthStore()
  const brandId = activeWorkspace?.id
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading } = useGetInventoryItems(brandId, currentPage, itemsPerPage)
  const { mutate: createItem, isPending: isCreating } = useCreateInventoryItem()
  const { mutate: updateItem, isPending: isUpdating } = useUpdateInventoryItem()
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteInventoryItem()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const paginatedData = data?.metadata || [];
  const totalPages = data?.options?.totalPages || 1;
  const totalCount = data?.options?.totalCount || 0;

  const handleOpenCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSubmit = (formData: any) => {
    if (!brandId) return
    if (editingItem) {
      updateItem({ brandId, itemId: editingItem.id, data: formData }, {
        onSuccess: () => setIsModalOpen(false)
      })
    } else {
      createItem({ brandId, data: formData }, {
        onSuccess: () => setIsModalOpen(false)
      })
    }
  }

  const handleDelete = () => {
    if (!brandId || !deletingId) return
    deleteItem({ brandId, itemId: deletingId }, {
      onSuccess: () => setDeletingId(null)
    })
  }

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        <Div vitri="row_between" className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <H variant="text_black" className="text-lg font-semibold">Danh mục Nguyên vật liệu</H>
          <Button variant="green" sizea="p4_2" onClick={handleOpenCreate} className="gap-2 shrink-0">
            <FaPlus /> Thêm mới
          </Button>
        </Div>

        {isLoading ? (
          <Div className="w-full p-8 justify-center">Đang tải...</Div>
        ) : (
          <Div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên vật liệu</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead>Giá tham chiếu (VND)</TableHead>
                    <TableHead>Mức tối thiểu</TableHead>
                    <TableHead>Nhà cung cấp</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-16">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item: InventoryItem) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku || '-'}</TableCell>
                        <TableCell>{item.baseUnit}</TableCell>
                        <TableCell>{item.minPrice?.toLocaleString()} - {item.maxPrice?.toLocaleString()}</TableCell>
                        <TableCell>{item.minStockLevel || 0}</TableCell>
                        <TableCell className="text-gray-700">{item.supplier?.name || '-'}</TableCell>
                        <TableCell>
                          {item.type === 'INGREDIENT' ? 'Nguyên liệu' : 
                           item.type === 'MATERIAL' ? 'Vật tư' : 'Khác'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.isActive ? 'Khả dụng' : 'Khóa'}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <button onClick={() => handleOpenEdit(item)} className="text-blue-500 hover:text-blue-700" title="Sửa">
                            <FaEdit size={18} />
                          </button>
                          <button onClick={() => setDeletingId(item.id)} className="text-red-500 hover:text-red-700" title="Xóa">
                            <FaTrash size={18} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center p-8 text-gray-500">Chưa có nguyên vật liệu nào</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
            <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative gap-4">
              <H className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">
                {editingItem ? "Sửa nguyên vật liệu" : "Thêm nguyên vật liệu"}
              </H>
              <InventoryItemForm 
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
          content="Bạn có chắc chắn muốn xóa nguyên vật liệu này không? Hành động này không thể hoàn tác."
          confirmText={isDeleting ? "Đang xóa..." : "Xóa"}
          cancelText="Hủy"
        />
      </Div>
    </FadeIn>
  )
}
