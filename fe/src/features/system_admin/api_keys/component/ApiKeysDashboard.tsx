import React, { useState } from 'react';
import { useGetApiKeys, useCreateApiKey, useRevokeApiKey, useActivateApiKey } from '@/src/features/system_admin/api_keys/hook/useApiKeys';
import { Button, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { ApiKey } from '@/src/features/system_admin/api_keys/type/api_key.type';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';
import { FaTrash, FaPlus, FaKey, FaBan, FaRegCopy, FaDatabase } from 'react-icons/fa';
import { SystemCreateApiKeyModal } from './SystemCreateApiKeyModal';
import { SystemUpdateApiKeyModal } from './SystemUpdateApiKeyModal';
import { toast } from 'sonner';

export const ApiKeysDashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useGetApiKeys({ page, limit });
  const [revokingId, setRevokingId] = useState<string | null>(null);
  
  const revokeMutation = useRevokeApiKey();
  const activateMutation = useActivateApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<any>(null);

  const handleRevoke = () => {
    if (!revokingId) return;
    revokeMutation.mutate(revokingId, {
      onSuccess: () => {
        setRevokingId(null);
      }
    });
  };

  const handleActivate = () => {
    if (!activatingId) return;
    activateMutation.mutate(activatingId, {
      onSuccess: () => {
        setActivatingId(null);
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã copy vào bộ nhớ tạm");
  };

  const apiKeys = data?.metadata?.keys || [];
  const totalPages = data?.metadata?.totalPages || 1;
  const total = data?.metadata?.total || 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa sử dụng';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    return formatDate(dateString);
  };

  return (
    <FadeIn>
      <div className="flex flex-col w-full gap-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <H level={2} className="font-bold text-gray-800 text-2xl">Quản lý API Key Toàn cục</H>
            <P className="text-gray-500 mt-1 text-sm">Quản lý và giám sát bảo mật toàn bộ API Key của các hệ thống AI</P>
          </div>
          <Button 
            className="bg-indigo-600 text-white h-[42px] px-6 rounded-xl font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2" 
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> Thêm API Key
          </Button>
        </div>
        
        <SystemCreateApiKeyModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Danh sách */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-800">Tên Khóa & Phân Loại</th>
                <th className="px-6 py-4 font-semibold text-gray-800">Sở hữu & Phạm vi</th>
                <th className="px-6 py-4 font-semibold text-gray-800">Nhà Cung Cấp</th>
                <th className="px-6 py-4 font-semibold text-gray-800">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-gray-800">Lịch sử Audit</th>
                <th className="px-6 py-4 font-semibold text-gray-800 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FaDatabase className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-gray-500 font-medium">Chưa có API Key nào được tạo.</p>
                      <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 font-medium hover:underline">Thêm ngay</button>
                    </div>
                  </td>
                </tr>
              ) : apiKeys.map((key: ApiKey) => (
                <tr key={key.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="font-bold text-gray-900">{key.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          key.keyType === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          key.keyType === 'BRAND' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {key.keyType}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-600 font-mono">
                          {key.prefix}***
                          <button onClick={() => handleCopy(key.prefix)} className="hover:text-indigo-600 p-0.5"><FaRegCopy className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-gray-800 font-medium text-sm">
                        {key.contactEmail || (key.keyType === 'ADMIN' ? 'Global System' : 'Chưa cập nhật')}
                      </span>
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
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <FaKey className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-gray-800">{key.chatbox?.name || 'Không rõ'}</span>
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
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
              <span className="text-sm text-gray-600">
                Hiển thị <span className="font-medium">{(page - 1) * limit + 1}</span> đến <span className="font-medium">{Math.min(page * limit, total)}</span> của <span className="font-medium">{total}</span> kết quả
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="rounded-lg border-gray-200 text-sm py-1.5 px-2 bg-gray-50 outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
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
          content="Bạn có chắc chắn muốn thu hồi (revoke) API Key này không? Các dịch vụ AI đang sử dụng key này sẽ ngừng hoạt động. Không thể hoàn tác hành động này."
        />
        <ConfirmModal
          open={!!activatingId}
          onClose={() => setActivatingId(null)}
          onConfirm={handleActivate}
          title="Kích hoạt lại API Key"
          content="Bạn có chắc chắn muốn kích hoạt lại API Key này không? Các dịch vụ AI sẽ có thể sử dụng lại key này để kết nối."
        />

        <SystemUpdateApiKeyModal
          isOpen={!!editingKey}
          onClose={() => setEditingKey(null)}
          apiKey={editingKey}
        />
      </div>
    </FadeIn>
  );
};
