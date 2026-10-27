import React, { useState } from 'react';
import { useGetApiKeys, useRevokeApiKey, useActivateApiKey, useGetActiveAiChatboxes } from '@/src/features/system_admin/api_keys/hook/useApiKeys';
import { Button, H, P } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { ApiKey } from '@/src/features/system_admin/api_keys/type/api_key.type';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';
import useDebounce from '@/src/core/hooks/useDebounce';
import { 
  FaPlus, 
  FaKey, 
  FaBan, 
  FaRegCopy, 
  FaDatabase, 
  FaSearch, 
  FaTimes, 
  FaCheckCircle, 
  FaRobot, 
  FaBolt, 
  FaLayerGroup, 
  FaTerminal, 
  FaChevronLeft, 
  FaChevronRight, 
  FaEdit, 
  FaCheck,
  FaShieldAlt,
  FaGlobe,
  FaUserAlt
} from 'react-icons/fa';
import { SiGoogle, SiOpenai, SiAnthropic, SiPerplexity } from 'react-icons/si';
import { SystemCreateApiKeyModal } from './SystemCreateApiKeyModal';
import { SystemUpdateApiKeyModal } from './SystemUpdateApiKeyModal';
import { toast } from 'sonner';

export const ApiKeysDashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [chatboxFilter, setChatboxFilter] = useState('ALL');
  const [keyTypeFilter, setKeyTypeFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const debouncedSearch = useDebounce({ value: searchInput, delay: 400 });

  const queryParams = {
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    chatboxId: chatboxFilter === 'ALL' ? undefined : chatboxFilter,
    keyType: keyTypeFilter === 'ALL' ? undefined : keyTypeFilter,
  };

  const { data, isLoading } = useGetApiKeys(queryParams);
  const { data: chatboxesData } = useGetActiveAiChatboxes();

  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<any>(null);

  const revokeMutation = useRevokeApiKey();
  const activateMutation = useActivateApiKey();

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Đã copy mã Prefix vào bộ nhớ tạm");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const apiKeys = data?.metadata?.keys || [];
  const totalPages = data?.metadata?.totalPages || 1;
  const total = data?.metadata?.total || 0;
  const chatboxes = chatboxesData?.metadata || [];

  // KPIs
  const activeCount = apiKeys.filter((k: ApiKey) => k.status === 'ACTIVE').length;
  const inactiveCount = apiKeys.filter((k: ApiKey) => k.status === 'REVOKED' || k.status === 'SUSPENDED').length;

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
    
    if (diffInSeconds < 60) return `${diffInSeconds}s trước`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h trước`;
    return formatDate(dateString);
  };

  const getProviderBadge = (name?: string) => {
    const provider = name?.toLowerCase() || '';
    if (provider.includes('gemini') || provider.includes('google')) {
      return {
        icon: <SiGoogle className="w-3.5 h-3.5 text-blue-500" />,
        bg: 'bg-blue-50/90 text-blue-700 border-blue-200/60',
        dot: 'bg-blue-500'
      };
    }
    if (provider.includes('openai')) {
      return {
        icon: <SiOpenai className="w-3.5 h-3.5 text-emerald-600" />,
        bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/60',
        dot: 'bg-emerald-500'
      };
    }
    if (provider.includes('anthropic') || provider.includes('claude')) {
      return {
        icon: <SiAnthropic className="w-3.5 h-3.5 text-amber-600" />,
        bg: 'bg-amber-50/90 text-amber-700 border-amber-200/60',
        dot: 'bg-amber-500'
      };
    }
    if (provider.includes('deepseek')) {
      return {
        icon: <FaRobot className="w-3.5 h-3.5 text-cyan-600" />,
        bg: 'bg-cyan-50/90 text-cyan-700 border-cyan-200/60',
        dot: 'bg-cyan-500'
      };
    }
    if (provider.includes('groq')) {
      return {
        icon: <FaBolt className="w-3.5 h-3.5 text-orange-500" />,
        bg: 'bg-orange-50/90 text-orange-700 border-orange-200/60',
        dot: 'bg-orange-500'
      };
    }
    if (provider.includes('mistral')) {
      return {
        icon: <FaLayerGroup className="w-3.5 h-3.5 text-rose-500" />,
        bg: 'bg-rose-50/90 text-rose-700 border-rose-200/60',
        dot: 'bg-rose-500'
      };
    }
    if (provider.includes('perplexity')) {
      return {
        icon: <SiPerplexity className="w-3.5 h-3.5 text-teal-600" />,
        bg: 'bg-teal-50/90 text-teal-700 border-teal-200/60',
        dot: 'bg-teal-500'
      };
    }
    if (provider.includes('grok') || provider.includes('xai')) {
      return {
        icon: <FaTerminal className="w-3.5 h-3.5 text-slate-700" />,
        bg: 'bg-slate-100 text-slate-800 border-slate-200/80',
        dot: 'bg-slate-700'
      };
    }
    return {
      icon: <FaKey className="w-3.5 h-3.5 text-indigo-600" />,
      bg: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/60',
      dot: 'bg-indigo-500'
    };
  };

  const getKeyTypeBadge = (keyType: string) => {
    switch (keyType) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'BRAND':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'CUSTOMER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200/80';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Đang hoạt động',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500 animate-pulse'
        };
      case 'REVOKED':
        return {
          label: 'Đã thu hồi',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500'
        };
      case 'SUSPENDED':
        return {
          label: 'Tạm ngưng',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500'
        };
      default:
        return {
          label: 'Hết hạn',
          bg: 'bg-gray-50 text-gray-700 border-gray-200/80',
          dot: 'bg-gray-400'
        };
    }
  };

  const resetFilters = () => {
    setSearchInput('');
    setStatusFilter('ALL');
    setChatboxFilter('ALL');
    setKeyTypeFilter('ALL');
    setPage(1);
  };

  const hasActiveFilters = searchInput || statusFilter !== 'ALL' || chatboxFilter !== 'ALL' || keyTypeFilter !== 'ALL';

  return (
    <FadeIn>
      <div className="flex flex-col w-full gap-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 flex-shrink-0 mt-0.5">
              <FaShieldAlt className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <H level={2} className="font-bold text-gray-900 text-xl sm:text-2xl tracking-tight">
                Quản lý API Key Toàn cục
              </H>
              <P className="text-gray-500 mt-1 text-xs sm:text-sm">
                Quản lý, cấp phát và giám sát bảo mật hệ thống khóa API kết nối các dịch vụ AI
              </P>
            </div>
          </div>
          <button 
            type="button"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-[44px] px-5 sm:px-6 rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 flex-shrink-0 w-full sm:w-auto cursor-pointer" 
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="w-3.5 h-3.5" /> <span>Thêm API Key</span>
          </button>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Tổng số API Key</span>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{total}</span>
              <span className="text-[11px] text-gray-400 mt-0.5">Toàn hệ thống</span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <FaKey className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Đang hoạt động</span>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">{activeCount}</span>
              <span className="text-[11px] text-emerald-600/80 mt-0.5">Sẵn sàng phản hồi</span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Tạm ngưng / Thu hồi</span>
              <span className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">{inactiveCount}</span>
              <span className="text-[11px] text-rose-500/80 mt-0.5">Bị ngắt kết nối</span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <FaBan className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Nhà cung cấp AI</span>
              <span className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{chatboxes.length}</span>
              <span className="text-[11px] text-purple-500/80 mt-0.5">Nền tảng kết nối</span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <FaRobot className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên key, email, prefix..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Nhà cung cấp filter */}
            <select
              value={chatboxFilter}
              onChange={(e) => { setChatboxFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="ALL">Tất cả Nhà cung cấp</option>
              {chatboxes.map((cb: any) => (
                <option key={cb.id} value={cb.id}>{cb.name}</option>
              ))}
            </select>

            {/* Trạng thái filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="SUSPENDED">Tạm ngưng</option>
              <option value="REVOKED">Đã thu hồi</option>
            </select>

            {/* Loại quyền filter */}
            <select
              value={keyTypeFilter}
              onChange={(e) => { setKeyTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="ALL">Tất cả quyền</option>
              <option value="ADMIN">Quản trị (ADMIN)</option>
              <option value="BRAND">Thương hiệu (BRAND)</option>
              <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <FaTimes className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Main List Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full flex flex-col">
          
          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tên Khóa & Phân Loại</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Sở Hữu & Phạm Vi</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Nhà Cung Cấp</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Lịch Sử Audit</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">Đang tải danh sách API Key...</span>
                      </div>
                    </td>
                  </tr>
                ) : apiKeys.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FaDatabase className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-gray-600 font-medium text-base">Không tìm thấy API Key nào.</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {hasActiveFilters ? 'Thử điều chỉnh hoặc đặt lại bộ lọc tìm kiếm' : 'Hệ thống chưa có khóa API nào được cấu hình'}
                        </p>
                        {hasActiveFilters ? (
                          <button onClick={resetFilters} className="mt-4 text-indigo-600 font-medium hover:underline text-sm">
                            Xóa bộ lọc
                          </button>
                        ) : (
                          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 font-medium hover:underline text-sm">
                            + Thêm API Key ngay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((key: ApiKey) => {
                    const providerBadge = getProviderBadge(key.chatbox?.name);
                    const statusBadge = getStatusBadge(key.status);

                    return (
                      <tr key={key.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-bold text-gray-900 text-sm">{key.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${getKeyTypeBadge(key.keyType)}`}>
                                {key.keyType}
                              </span>
                              <div 
                                onClick={() => handleCopy(key.id, key.prefix)}
                                title="Nhấp để copy prefix"
                                className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/70 rounded-md text-xs text-slate-700 font-mono transition-colors cursor-pointer"
                              >
                                <span>{key.prefix}***</span>
                                {copiedId === key.id ? (
                                  <FaCheck className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <FaRegCopy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-gray-800 font-medium text-sm">
                              {key.contactEmail ? (
                                <>
                                  <FaUserAlt className="w-3 h-3 text-gray-400" />
                                  <span>{key.contactEmail}</span>
                                </>
                              ) : (
                                <>
                                  <FaGlobe className="w-3.5 h-3.5 text-indigo-500" />
                                  <span className="text-indigo-600 font-semibold">Global System</span>
                                </>
                              )}
                            </div>
                            {key.restrictedModel ? (
                              <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md border border-amber-200/80 bg-amber-50 text-[11px] font-medium text-amber-800">
                                Chỉ dùng: {key.restrictedModel.displayName || key.restrictedModel.name}
                              </span>
                            ) : (
                              <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md border border-emerald-200/80 bg-emerald-50 text-[11px] font-medium text-emerald-800">
                                Toàn bộ Mô hình
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${providerBadge.bg}`}>
                            {providerBadge.icon}
                            <span className="font-semibold text-xs">{key.chatbox?.name || 'Không rõ'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                            {statusBadge.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-800 text-xs font-semibold">{timeAgo(key.lastUsedAt)}</span>
                            <span className="text-[11px] text-gray-400 font-mono">IP: {key.lastIp || 'N/A'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingKey(key)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all"
                              title="Chỉnh sửa thông tin"
                            >
                              <FaEdit className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            {key.status === 'ACTIVE' ? (
                              <button
                                onClick={() => setRevokingId(key.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all"
                                title="Thu hồi khóa"
                              >
                                <FaBan className="w-3.5 h-3.5" />
                                <span>Thu hồi</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setActivatingId(key.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-lg transition-all"
                                title="Kích hoạt lại khóa"
                              >
                                <FaCheck className="w-3.5 h-3.5" />
                                <span>Kích hoạt</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (< md) */}
          <div className="md:hidden divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Đang tải danh sách API Key...</span>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FaDatabase className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-600 font-medium text-sm">Không tìm thấy API Key nào.</p>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="mt-3 text-indigo-600 font-medium hover:underline text-xs">
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              apiKeys.map((key: ApiKey) => {
                const providerBadge = getProviderBadge(key.chatbox?.name);
                const statusBadge = getStatusBadge(key.status);

                return (
                  <div key={key.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50/50 transition-colors">
                    {/* Card Top: Name + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{key.name}</span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          {key.contactEmail ? (
                            <span>{key.contactEmail}</span>
                          ) : (
                            <span className="text-indigo-600 font-medium">Global System</span>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusBadge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Card Mid: Provider, KeyType & Prefix */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${providerBadge.bg}`}>
                        {providerBadge.icon}
                        {key.chatbox?.name || 'Không rõ'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${getKeyTypeBadge(key.keyType)}`}>
                        {key.keyType}
                      </span>
                      <div 
                        onClick={() => handleCopy(key.id, key.prefix)}
                        className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono text-slate-700 cursor-pointer"
                      >
                        <span>{key.prefix}***</span>
                        {copiedId === key.id ? (
                          <FaCheck className="w-2.5 h-2.5 text-emerald-600" />
                        ) : (
                          <FaRegCopy className="w-2.5 h-2.5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Card Details: Scope & Audit */}
                    <div className="flex flex-col gap-1 text-xs text-gray-500 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Phạm vi:</span>
                        {key.restrictedModel ? (
                          <span className="text-amber-800 font-medium truncate max-w-[200px]">
                            {key.restrictedModel.displayName || key.restrictedModel.name}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Toàn bộ Mô hình</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Lịch sử:</span>
                        <span className="text-gray-700 font-medium">{timeAgo(key.lastUsedAt)} (IP: {key.lastIp || 'N/A'})</span>
                      </div>
                    </div>

                    {/* Card Bottom: Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setEditingKey(key)}
                        className="flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50/70 hover:bg-indigo-50 rounded-xl border border-indigo-100/70 transition-colors"
                      >
                        <FaEdit className="w-3 h-3" /> Sửa
                      </button>
                      {key.status === 'ACTIVE' ? (
                        <button
                          onClick={() => setRevokingId(key.id)}
                          className="flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50/70 hover:bg-rose-50 rounded-xl border border-rose-100/70 transition-colors"
                        >
                          <FaBan className="w-3 h-3" /> Thu hồi
                        </button>
                      ) : (
                        <button
                          onClick={() => setActivatingId(key.id)}
                          className="flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/70 hover:bg-emerald-50 rounded-xl border border-emerald-100/70 transition-colors"
                        >
                          <FaCheck className="w-3 h-3" /> Kích hoạt lại
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100 bg-white">
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Hiển thị <span className="font-semibold text-gray-800">{total > 0 ? (page - 1) * limit + 1 : 0}</span> đến{" "}
              <span className="font-semibold text-gray-800">{Math.min(page * limit, total)}</span> trong tổng số{" "}
              <span className="font-semibold text-gray-800">{total}</span> kết quả
              {totalPages > 1 && <span className="text-gray-400 ml-1.5 font-normal">(Trang {page}/{totalPages})</span>}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="hidden sm:inline">Hiển thị:</span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="rounded-lg border border-gray-200 text-xs py-1.5 px-2 bg-gray-50 text-gray-700 outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors border border-gray-200/70"
                >
                  <FaChevronLeft className="w-2.5 h-2.5" />
                  <span>Trước</span>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <React.Fragment key={p}>
                        {prev && p - prev > 1 && <span className="px-1 text-gray-400 text-xs">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
                            page === p
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors border border-gray-200/70"
                >
                  <span>Sau</span>
                  <FaChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Confirm Modals */}
        <ConfirmModal
          open={!!revokingId}
          onClose={() => setRevokingId(null)}
          onConfirm={handleRevoke}
          type="danger"
          title="Thu hồi API Key"
          content="Bạn có chắc chắn muốn thu hồi (revoke) API Key này không? Toàn bộ các dịch vụ AI đang sử dụng key này sẽ ngừng hoạt động ngay lập tức."
          confirmText="Thu hồi khóa"
        />

        <ConfirmModal
          open={!!activatingId}
          onClose={() => setActivatingId(null)}
          onConfirm={handleActivate}
          type="success"
          title="Kích hoạt lại API Key"
          content="Bạn có chắc chắn muốn kích hoạt lại API Key này không? Các dịch vụ AI trong hệ thống sẽ có thể tiếp tục sử dụng khóa này."
          confirmText="Kích hoạt lại"
        />

        <SystemUpdateApiKeyModal
          isOpen={!!editingKey}
          onClose={() => setEditingKey(null)}
          apiKey={editingKey}
        />

        <SystemCreateApiKeyModal
          open={isModalOpen}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </FadeIn>
  );
};
