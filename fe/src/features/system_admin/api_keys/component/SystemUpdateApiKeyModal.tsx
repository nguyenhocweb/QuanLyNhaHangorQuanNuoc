import React, { useEffect } from 'react';
import { Modal } from '@/src/core/components/layout/public-Modal';
import { FaSave, FaRobot, FaLayerGroup, FaEnvelope, FaUserShield, FaTag, FaCheckCircle, FaEdit } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiKeyUpdateSchema, ApiKeyUpdateValues } from '../schema/api_key.update.schema';
import { useUpdateApiKey, useGetActiveAiModels } from '../hook/useApiKeys';
import { toast } from 'sonner';

interface Props {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  apiKey: any;
}

export const SystemUpdateApiKeyModal: React.FC<Props> = ({ open, isOpen, onClose, apiKey }) => {
  const isModalOpen = open ?? isOpen ?? false;
  const updateMutation = useUpdateApiKey();
  
  const chatboxIdValue = apiKey?.chatboxId;
  const { data: modelsData, isLoading: isLoadingModels } = useGetActiveAiModels(chatboxIdValue);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ApiKeyUpdateValues>({
    resolver: zodResolver(apiKeyUpdateSchema) as any,
    defaultValues: {
      name: '',
      contactEmail: '',
      restrictedModelId: ''
    }
  });

  const models = modelsData?.metadata || [];

  useEffect(() => {
    if (isModalOpen && apiKey) {
      reset({
        name: apiKey.name || '',
        contactEmail: apiKey.contactEmail || '',
        restrictedModelId: apiKey.restrictedModelId || '',
        keyType: apiKey.keyType || 'BRAND'
      });
    }
  }, [isModalOpen, apiKey, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ApiKeyUpdateValues) => {
    if (!apiKey) return;

    const payload = {
      ...data,
      contactEmail: data.contactEmail || undefined,
      restrictedModelId: data.restrictedModelId || undefined
    };

    updateMutation.mutate(
      { id: apiKey.id, payload },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật thông tin API Key thành công');
          handleClose();
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Có lỗi xảy ra khi cập nhật API Key');
        }
      }
    );
  };

  if (!apiKey) return null;

  return (
    <Modal open={isModalOpen} onClose={handleClose} title="Cập nhật API Key" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-5">
        
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/50 rounded-2xl border border-indigo-100/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-blue-200">
            <FaEdit className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">Chỉnh sửa thông tin cấu hình API Key</span>
            <span className="text-slate-500 text-xs mt-0.5 leading-relaxed">
              Bạn có thể điều chỉnh tên gợi nhớ, người quản lý hoặc giới hạn Model AI áp dụng cho khóa này.
            </span>
          </div>
        </div>

        {/* Form Body: 2 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* 1. Nhà cung cấp AI (Read only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FaRobot className="text-indigo-500 w-3.5 h-3.5" />
              <span>Nhà cung cấp AI</span>
              <span className="text-[10px] text-gray-400 font-normal">(Cố định)</span>
            </label>
            <input 
              value={apiKey.chatbox?.name || 'Không xác định'} 
              disabled
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 bg-gray-100 text-sm text-slate-600 font-medium cursor-not-allowed outline-none"
            />
          </div>

          {/* 2. Giới hạn Model ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FaLayerGroup className="text-indigo-500 w-3.5 h-3.5" />
                <span>Mô hình áp dụng (Scope)</span>
              </span>
              <span className="text-[10.5px] text-gray-400 font-normal">Tùy chọn</span>
            </label>
            <Controller
              name="restrictedModelId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  disabled={isLoadingModels}
                  className="w-full rounded-xl border border-gray-200 hover:border-gray-300 px-3.5 py-2.5 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 outline-none transition-all cursor-pointer font-medium disabled:opacity-40"
                >
                  <option value="">✨ Dùng chung toàn bộ Model</option>
                  {models.map((model: any) => (
                    <option key={model.id} value={model.id}>
                      {model.displayName} ({model.name})
                    </option>
                  ))}
                </select>
              )}
            />
            {isLoadingModels && (
              <span className="text-[11px] text-indigo-500 animate-pulse">Đang tải models...</span>
            )}
          </div>

          {/* 3. Phân quyền sử dụng (Key Type) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FaUserShield className="text-indigo-500 w-3.5 h-3.5" />
              <span>Phân quyền sử dụng</span>
              <span className="text-red-500">*</span>
            </label>
            <Controller
              name="keyType"
              control={control}
              render={({ field }) => (
                <select 
                  {...field}
                  className="w-full rounded-xl border border-gray-200 hover:border-gray-300 px-3.5 py-2.5 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="BRAND">🏢 Dùng chung Thương hiệu (BRAND)</option>
                  <option value="ADMIN">🛡️ Quản trị viên hệ thống (ADMIN)</option>
                  <option value="CUSTOMER">👤 Khách hàng (CUSTOMER)</option>
                </select>
              )}
            />
          </div>

          {/* 4. Email liên hệ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FaEnvelope className="text-indigo-500 w-3.5 h-3.5" />
                <span>Email người quản lý key</span>
              </span>
              <span className="text-[10.5px] text-gray-400 font-normal">Tùy chọn</span>
            </label>
            <Controller
              name="contactEmail"
              control={control}
              render={({ field }) => (
                <input 
                  {...field}
                  type="email"
                  placeholder="admin@nhahang.vn hoặc chủ key" 
                  className={`w-full rounded-xl border px-3.5 py-2.5 bg-gray-50/70 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${
                    errors.contactEmail ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              )}
            />
            {errors.contactEmail && (
              <span className="text-[11px] text-red-500 font-medium">{errors.contactEmail.message}</span>
            )}
          </div>

          {/* 5. Tên gợi nhớ */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FaTag className="text-indigo-500 w-3.5 h-3.5" />
              <span>Tên gợi nhớ cho API Key</span>
              <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input 
                  {...field}
                  placeholder="Vd: Google Gemini 2.0 Flash Production (Khóa chính)" 
                  className={`w-full rounded-xl border px-3.5 py-2.5 bg-gray-50/70 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${
                    errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              )}
            />
            {errors.name && (
              <span className="text-[11px] text-red-500 font-medium">{errors.name.message}</span>
            )}
          </div>

          {/* Key Prefix preview */}
          <div className="flex items-center justify-between sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600">
            <span className="font-medium">Mã tiền tố khóa hiện tại:</span>
            <span className="font-mono px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold text-slate-800">
              {apiKey.prefix}***
            </span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button 
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-slate-600 text-sm font-medium transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
          >
            {updateMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <FaSave className="w-3.5 h-3.5" />
                <span>Lưu Thay Đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
