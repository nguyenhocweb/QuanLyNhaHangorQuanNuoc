"use client"
import React, { useState } from 'react'
import { Div, Button } from '@/src/core/components/ui'
import { FaCheckCircle, FaExclamationCircle, FaEdit, FaPaperPlane, FaListAlt, FaTrash } from 'react-icons/fa'
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal'
import { ReviewStockCountModal } from './ReviewStockCountModal'
import { toast } from 'sonner'
import FadeIn from '@/src/core/components/animation/FadeIn'
import { StaffStockCountForm } from '@/src/features/staff/inventory/components/StaffStockCountForm'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { useCreateStockCount } from '@/src/features/staff/inventory/hooks/useCreateStockCount'
import { useGetStockCounts } from '@/src/features/staff/inventory/hooks/useGetStockCounts'
import { useSubmitStockCount } from '@/src/features/staff/inventory/hooks/useSubmitStockCount'
import { useUpdateStockCount } from '@/src/features/staff/inventory/hooks/useUpdateStockCount'
import { useDeleteStockCount } from '@/src/features/staff/inventory/hooks/useDeleteStockCount'
import { useApproveStockCount } from '@/src/features/staff/inventory/hooks/useApproveStockCount'
import { useRejectStockCount } from '@/src/features/staff/inventory/hooks/useRejectStockCount'

import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'

export const ManagerInventoryDashboard = () => {
  const { user, activeWorkspace } = useAuthStore();
  const role = user?.role || "Quản lý nhà hàng";
  const restaurantId = activeWorkspace?.id || "";

  const [selectedCount, setSelectedCount] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { mutate: createStockCount, isPending: isCreatingCount } = useCreateStockCount();
  const { mutate: submitStockCount, isPending: isSubmittingCount } = useSubmitStockCount();
  const { mutate: updateStockCount, isPending: isUpdatingCount } = useUpdateStockCount();
  const { mutate: deleteStockCount, isPending: isDeletingCount } = useDeleteStockCount();
  const { mutate: approveStockCount, isPending: isApprovingCount } = useApproveStockCount();
  const { mutate: rejectStockCount, isPending: isRejectingCount } = useRejectStockCount();
  
  const { data: stockCountsData, isLoading } = useGetStockCounts(restaurantId, role, undefined, currentPage, itemsPerPage);
  const stockCounts = Array.isArray(stockCountsData?.metadata?.counts) 
    ? stockCountsData.metadata.counts 
    : [];

  const totalCount = stockCountsData?.metadata?.options?.totalCount || 0;
  const totalPages = stockCountsData?.metadata?.options?.totalPages || 1;

  const threshold = stockCountsData?.metadata?.threshold || 0;

  const handleApprove = (reason: string) => {
    if (!selectedCount) return;
    approveStockCount(
      { id: selectedCount.id, role, reason },
      {
        onSuccess: () => {
          setSelectedCount(null);
        }
      }
    );
  };

  const handleReject = (reason: string) => {
    if (!selectedCount) return;
    rejectStockCount(
      { id: selectedCount.id, role, reason },
      {
        onSuccess: () => {
          setSelectedCount(null);
        }
      }
    );
  };

  const handleSubmitDraft = (id: string) => {
    submitStockCount({ id, role });
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteStockCount(
        { id: deletingId, role },
        {
          onSuccess: () => {
            setDeletingId(null);
          }
        }
      );
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">Bản nháp</span>;
      case "PENDING_APPROVAL":
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Chờ duyệt</span>;
      case "APPROVED":
      case "COMPLETED":
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Đã duyệt</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">Đã từ chối</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <FadeIn className="w-full flex flex-col gap-6">
      <Div vitri="col_none" className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <Div vitri="row_between" className="w-full mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaListAlt className="text-blue-500" /> Danh Sách Phiếu Kiểm Kho ({totalCount})
          </h3>
          <Button variant="green" sizea="p4_2" className="gap-2" onClick={() => setIsCreating(true)}>
            <FaPlus /> Tự Kiểm Kho
          </Button>
        </Div>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 w-full">Đang tải dữ liệu...</div>
        ) : stockCounts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 w-full">Chưa có phiếu kiểm kho nào.</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl w-[20%]">Mã phiếu</th>
                  <th className="px-4 py-3 w-[20%]">Ngày tạo</th>
                  <th className="px-4 py-3 w-[15%]">Người tạo</th>
                  <th className="px-4 py-3 w-[15%]">Trạng thái</th>
                  <th className="px-4 py-3 text-right rounded-tr-xl w-[30%]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {stockCounts.map((count: any) => (
                  <tr key={count.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{count.code || count.id}</td>
                    <td className="px-4 py-3">{new Date(count.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-3">{count.creatorName}</td>
                    <td className="px-4 py-3">{renderStatus(count.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {count.status === "DRAFT" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="white" 
                            sizea="p4_2" 
                            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => setEditingDraft(count)}
                          >
                            <FaEdit size={12} />
                          </Button>
                          <Button 
                            variant="green" 
                            sizea="p4_2" 
                            className="gap-2"
                            onClick={() => handleSubmitDraft(count.id)}
                            disabled={isSubmittingCount}
                          >
                            <FaPaperPlane size={12} /> Nộp
                          </Button>
                          {count.creatorRole !== "Chủ thương hiệu" && (
                            <Button 
                              variant="red" 
                              sizea="p4_2" 
                              className="gap-2"
                              onClick={() => setDeletingId(count.id)}
                            >
                              <FaTrash size={12} />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button variant="blue" sizea="p4_2" onClick={() => setSelectedCount(count)}>
                          Chi Tiết
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {stockCounts.length > 0 && (
          <div className="w-full flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 mt-4 rounded-xl">
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

      {selectedCount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
            <ReviewStockCountModal 
              stockCountId={selectedCount.id}
              status={selectedCount.status}
              items={selectedCount.items}
              threshold={threshold}
              isPending={isApprovingCount || isRejectingCount}
              onApprove={handleApprove}
              onReject={handleReject}
              onClose={() => setSelectedCount(null)}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa phiếu"
        content="Bạn có chắc chắn muốn xóa phiếu kiểm kho này không? Hành động này sẽ không thể khôi phục."
        isLoading={isDeletingCount}
      />

      {(isCreating || editingDraft) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden p-6 relative">
            <button onClick={() => { setIsCreating(false); setEditingDraft(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingDraft ? "Chỉnh sửa Bản Nháp" : "Tự Kiểm Kho"}</h2>
            <StaffStockCountForm 
              brandId={user?.brand?.[0]?.id || ""} 
              restaurantId={restaurantId} 
              initialData={editingDraft}
              isPending={isCreatingCount || isUpdatingCount}
              onSubmit={(data) => {
                if (editingDraft) {
                  updateStockCount(
                    { id: editingDraft.id, role, data },
                    {
                      onSuccess: () => {
                        setEditingDraft(null);
                      }
                    }
                  );
                } else {
                  createStockCount(
                    { data, role },
                    {
                      onSuccess: () => {
                        setIsCreating(false);
                      }
                    }
                  );
                }
              }}
              onClose={() => { setIsCreating(false); setEditingDraft(null); }}
            />
          </div>
        </div>
      )}
    </FadeIn>
  )
}
