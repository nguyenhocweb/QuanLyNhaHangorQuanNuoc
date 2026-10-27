import React, { useState } from 'react';
import { Modal } from '@/src/core/components/layout/public-Modal';
import { useCreateApiKey, useGetActiveAiChatboxes, useGetActiveAiModels } from '@/src/features/system_admin/api_keys/hook/useApiKeys';
import { 
  FaPlus, 
  FaKey, 
  FaShieldAlt, 
  FaRobot, 
  FaLayerGroup, 
  FaEnvelope, 
  FaUserShield, 
  FaTag, 
  FaEye, 
  FaEyeSlash,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiKeySchema, ApiKeyFormValues } from '../schema/api_key.schema';
import { toast } from 'sonner';

interface SystemCreateApiKeyModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}

export const SystemCreateApiKeyModal: React.FC<SystemCreateApiKeyModalProps> = ({ open, isOpen, onClose }) => {
  const isModalOpen = open ?? isOpen ?? false;
  const [showKey, setShowKey] = useState(false);
  const createMutation = useCreateApiKey();
  const { data: chatboxesData, isLoading: isLoadingChatboxes } = useGetActiveAiChatboxes();
  
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema) as any,
    defaultValues: {
      name: '',
      providedKey: '',
      chatboxId: '',
      keyType: 'BRAND',
      contactEmail: '',
      restrictedModelId: ''
    }
  });

  const chatboxIdValue = watch('chatboxId');
  const { data: modelsData, isLoading: isLoadingModels } = useGetActiveAiModels(chatboxIdValue);

  const chatboxes = chatboxesData?.metadata || [];
  const models = modelsData?.metadata || [];

  const handleClose = () => {
    reset();
    setShowKey(false);
    onClose();
  };

  const onSubmit = (data: ApiKeyFormValues) => {
    const payload = {
      ...data,
      contactEmail: data.contactEmail || undefined,
      restrictedModelId: data.restrictedModelId || undefined
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Đã thêm API Key mới thành công');
        handleClose();
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Có lỗi xảy ra khi thêm API Key');
      }
    });
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose} title="Thêm API Key mới" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-5">
        
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-blue-50/50 rounded-2xl border border-indigo-100/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-indigo-200">
            <FaShieldAlt className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">Cấp phát & Tích hợp Khóa AI Toàn cục</span>
            <span className="text-slate-500 text-xs mt-0.5 leading-relaxed">
              Khóa API này sẽ được mã hóa bảo mật chuẩn AES-256. Bạn có thể cho phép sử dụng chung toàn hệ thống hoặc giới hạn riêng cho từng mô hình AI cụ thể.
            </span>
          </div>
        </div>

        {/* Form Body: 2 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* 1. Nhà cung cấp AI */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FaRobot className="text-indigo-500 w-3.5 h-3.5" />
              <span>Nhà cung cấp AI</span>
              <span className="text-red-500">*</span>
            </label>
            <Controller
              name="chatboxId"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    disabled={isLoadingChatboxes}
                    className={`w-full rounded-xl border px-3.5 py-2.5 bg-gray-50/70 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer font-medium disabled:opacity-50 ${
                      errors.chatboxId ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="" disabled>-- Chọn Nhà Cung Cấp ({chatboxes.length}) --</option>
                    {chatboxes.map((chatbox: any) => (
                      <option key={chatbox.id} value={chatbox.id}>
                        {chatbox.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
            {errors.chatboxId && (
              <span className="text-[11px] text-red-500 font-medium">{errors.chatboxId.message}</span>
            )}
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
                <div className="relative">
                  <select
                    {...field}
                    disabled={!chatboxIdValue || isLoadingModels}
                    className="w-full rounded-xl border border-gray-200 hover:border-gray-300 px-3.5 py-2.5 bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 outline-none transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="">✨ Dùng chung toàn bộ Model</option>
                    {models.map((model: any) => (
                      <option key={model.id} value={model.id}>
                        {model.displayName} ({model.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
            {isLoadingModels && (
              <span className="text-[11px] text-indigo-500 animate-pulse">Đang tải danh sách model...</span>
            )}
            {!chatboxIdValue && (
              <span className="text-[11px] text-gray-400">Chọn nhà cung cấp để xem danh sách models</span>
            )}
          </div>

          {/* 3. Loại quyền hạn (Key Type) */}
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
                  className={`w-full rounded-xl border px-3.5 py-2.5 bg-gray-50/70 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer font-medium ${
                    errors.keyType ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="BRAND">🏢 Dùng chung Thương hiệu (BRAND)</option>
                  <option value="ADMIN">🛡️ Quản trị viên hệ thống (ADMIN)</option>
                  <option value="CUSTOMER">👤 Khách hàng (CUSTOMER)</option>
                </select>
              )}
            />
            {errors.keyType && (
              <span className="text-[11px] text-red-500 font-medium">{errors.keyType.message}</span>
            )}
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
          
          {/* 6. API Key thực tế */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FaKey className="text-indigo-500 w-3.5 h-3.5" />
              <span>API Key thực tế (Secret Token)</span>
              <span className="text-red-500">*</span>
            </label>
            <Controller
              name="providedKey"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input 
                    {...field}
                    type={showKey ? 'text' : 'password'}
                    placeholder="Dán mã API Key thật vào đây (sk-..., AIzaSy..., v.v.)" 
                    className={`w-full rounded-xl border pl-3.5 pr-11 py-2.5 bg-gray-50/70 text-sm font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all ${
                      errors.providedKey ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    title={showKey ? "Ẩn khóa" : "Hiện khóa"}
                  >
                    {showKey ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              )}
            />
            {errors.providedKey ? (
              <span className="text-[11px] text-red-500 font-medium">{errors.providedKey.message}</span>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-0.5">
                <FaCheckCircle className="w-3 h-3" />
                <span>Mã khóa được băm bảo mật SHA-256 và mã hóa đối xứng an toàn trước khi lưu.</span>
              </div>
            )}
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
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
          >
            {createMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang lưu khóa...</span>
              </>
            ) : (
              <>
                <FaPlus className="w-3.5 h-3.5" />
                <span>Lưu & Kích hoạt Key</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
