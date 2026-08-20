import React, { useState } from 'react';
import { Div, Button, H } from '@/src/core/components/ui';
import { FaKey, FaPlus, FaTrash, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaDatabase, FaRegCopy, FaBan } from 'react-icons/fa';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetApiKeys, useRevokeApiKey, useActivateApiKey } from '../hooks/useApiKeys';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';
import { CreateApiKeyFormModal } from './CreateApiKeyFormModal';
import { UpdateApiKeyFormModal } from './UpdateApiKeyFormModal';
import { toast } from 'sonner';

export const ApiKeyDashboard = () => {
  const { activeWorkspace } = useAuthStore();
  const brandId = activeWorkspace?.id;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<any>(null);

  const { data: keysData, isLoading } = useGetApiKeys(brandId, currentPage, itemsPerPage);
  const revokeMutation = useRevokeApiKey();
  const activateMutation = useActivateApiKey();

  const keys = Array.isArray(keysData?.metadata?.keys) ? keysData.metadata.keys : [];
  const totalPages = keysData?.metadata?.totalPages || 1;
  const totalCount = keysData?.metadata?.total || 0;

  const handleRevoke = () => {
    if (revokingId && brandId) {
      revokeMutation.mutate({ brandId, id: revokingId }, {
        onSuccess: () => setRevokingId(null)
      });
    }
  };

  const handleActivate = () => {
    if (activatingId && brandId) {
      activateMutation.mutate({ brandId, id: activatingId }, {
        onSuccess: () => setActivatingId(null)
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã copy vào bộ nhớ tạm");
  };

  const timeAgo = (dateString: string | null) => {
    if (!dateString) return 'Chưa sử dụng';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <FadeIn className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <H level={2} className="text-2xl font-bold text-gray-800">Quản lý API Key (Thương hiệu)</H>
          <p className="text-gray-500 text-sm mt-1">Quản lý các khóa truy cập AI Models dành riêng cho thương hiệu của bạn.</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-[42px] px-6 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 font-medium"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus /> Tạo Key Mới
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên Khóa & Thông tin</th>
                <th className="px-6 py-4 font-semibold">Nhà Cung Cấp & Model</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Lịch sử Audit</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FaDatabase className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-gray-500 font-medium">Bạn chưa tạo API Key nào.</p>
                      <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 text-indigo-600 font-medium hover:underline">Tạo Key ngay</button>
                    </div>
                  </td>
                </tr>
              ) : (
                keys.map((key: any, index: number) => (
                  <tr key={key.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="font-bold text-gray-900">{key.name}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {key.contactEmail}
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-600 font-mono">
                            {key.prefix}***
                            <button onClick={() => handleCopy(key.prefix)} className="hover:text-indigo-600 p-0.5"><FaRegCopy className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <FaKey className="w-3 h-3" />
                          </div>
                          <span className="font-semibold text-gray-800">{key.chatbox?.name || 'Không rõ'}</span>
                        </div>
                        {key.restrictedModel ? (
                          <span className="inline-flex w-fit items-center px-2 py-0.5 rounded border border-orange-200 bg-orange-50 text-[10.5px] font-medium text-orange-700">
                            Chỉ dùng: {key.restrictedModel.displayName || key.restrictedModel.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">All Models</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        key.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        key.status === 'REVOKED' ? 'bg-red-100 text-red-800' : 
                        key.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {key.status === 'ACTIVE' ? 'Đang hoạt động' : 
                         key.status === 'REVOKED' ? 'Đã thu hồi' :
                         key.status === 'SUSPENDED' ? 'Tạm ngưng' : 'Đã hết hạn'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-800 text-sm font-medium">{timeAgo(key.lastUsedAt)}</span>
                        <span className="text-xs text-gray-500">IP: {key.lastIp || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end w-full gap-2">
                        {key.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => setEditingKey(key)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                              title="Sửa thông tin"
                            >
                              <FaKey className="w-3.5 h-3.5" /> <span className="text-xs font-medium">Sửa</span>
                            </button>
                            <button
                              onClick={() => setRevokingId(key.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Thu hồi khóa"
                            >
                              <FaBan className="w-3.5 h-3.5" /> <span className="text-xs font-medium">Thu hồi</span>
                            </button>
                          </>
                        )}
                        {(key.status === 'REVOKED' || key.status === 'SUSPENDED') && (
                          <button
                            onClick={() => setActivatingId(key.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                            title="Kích hoạt lại khóa"
                          >
                            <FaKey className="w-3.5 h-3.5" /> <span className="text-xs font-medium">Kích hoạt lại</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION UI */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
            <span className="text-sm text-gray-600">
              Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCount)}</span> của <span className="font-medium">{totalCount}</span> kết quả
            </span>
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="rounded-lg border-gray-200 text-sm py-1.5 px-2 bg-gray-50 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!revokingId}
        onClose={() => setRevokingId(null)}
        onConfirm={handleRevoke}
        title="Thu hồi API Key"
        content="Bạn có chắc chắn muốn thu hồi (vô hiệu hóa vĩnh viễn) API Key này không? Các ứng dụng của thương hiệu bạn đang dùng key này sẽ không thể kết nối vào hệ thống AI nữa."
      />

      <ConfirmModal
        open={!!activatingId}
        onClose={() => setActivatingId(null)}
        onConfirm={handleActivate}
        title="Kích hoạt lại API Key"
        content="Bạn có chắc chắn muốn kích hoạt lại API Key này không? Các ứng dụng sẽ có thể sử dụng lại key này để kết nối."
      />

      <CreateApiKeyFormModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <UpdateApiKeyFormModal
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
        apiKey={editingKey}
      />
    </FadeIn>
  );
};
