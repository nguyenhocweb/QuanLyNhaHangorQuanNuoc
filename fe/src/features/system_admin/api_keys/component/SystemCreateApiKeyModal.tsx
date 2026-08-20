import React from 'react';
import { Modal } from '@/src/core/components/layout/public-Modal';
import { Button, Input, P } from '@/src/core/components/ui';
import { useCreateApiKey, useGetActiveAiChatboxes, useGetActiveAiModels } from '@/src/features/system_admin/api_keys/hook/useApiKeys';
import { FaPlus } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiKeySchema, ApiKeyFormValues } from '../schema/api_key.schema';
import { toast } from 'sonner';

interface SystemCreateApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export const SystemCreateApiKeyModal: React.FC<SystemCreateApiKeyModalProps> = ({ open, onClose }) => {
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
    onClose();
  };

  const onSubmit = (data: ApiKeyFormValues) => {
    // Convert empty strings to undefined to match schema/backend expectations if needed
    const payload = {
      ...data,
      contactEmail: data.contactEmail || undefined,
      restrictedModelId: data.restrictedModelId || undefined
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Đã thêm API Key thành công');
        handleClose();
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi thêm API Key');
      }
    });
  };

  return (
    <Modal open={open} onClose={handleClose} title="Thêm API Key mới">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-5">
        <P className="text-gray-500 text-sm">
          Key được thêm ở đây có thể dùng chung cho toàn hệ thống (Global) hoặc chỉ định cấp quyền riêng (Brand Specific).
        </P>

        <div className="flex flex-col w-full gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Chatbox ID (Nhà cung cấp) <span className="text-red-500">*</span></label>
            <Controller
              name="chatboxId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`rounded-xl border px-4 py-2.5 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full outline-none transition-all disabled:opacity-50 ${errors.chatboxId ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isLoadingChatboxes}
                >
                  <option value="" disabled>-- Chọn Nhà Cung Cấp --</option>
                  {chatboxes.map((chatbox: any) => (
                    <option key={chatbox.id} value={chatbox.id}>{chatbox.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.chatboxId && <span className="text-xs text-red-500">{errors.chatboxId.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Giới hạn Model ID (Tùy chọn)</label>
            <Controller
              name="restrictedModelId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="rounded-xl border-gray-300 px-4 py-2.5 bg-gray-50 border focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full outline-none transition-all disabled:opacity-50"
                  disabled={!chatboxIdValue || isLoadingModels}
                >
                  <option value="">-- Dùng chung toàn bộ Model --</option>
                  {models.map((model: any) => (
                    <option key={model.id} value={model.id}>{model.displayName} ({model.name})</option>
                  ))}
                </select>
              )}
            />
            {isLoadingModels && <span className="text-xs text-gray-400">Đang tải models...</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email liên hệ (Tùy chọn)</label>
            <Controller
              name="contactEmail"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field}
                  placeholder="Email của người giữ key" 
                  className={`h-[42px] w-full ${errors.contactEmail ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.contactEmail && <span className="text-xs text-red-500">{errors.contactEmail.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Loại quyền (Key Type) <span className="text-red-500">*</span></label>
            <Controller
              name="keyType"
              control={control}
              render={({ field }) => (
                <select 
                  {...field}
                  className={`rounded-xl border px-4 py-2.5 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full outline-none transition-all ${errors.keyType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                  <option value="BRAND">Dùng chung Thương hiệu (BRAND)</option>
                </select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tên gợi nhớ <span className="text-red-500">*</span></label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field}
                  placeholder="Vd: Key chính ChatGPT" 
                  className={`h-[42px] w-full ${errors.name ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">API Key thực tế <span className="text-red-500">*</span></label>
            <Controller
              name="providedKey"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field}
                  placeholder="Dán API Key thật vào đây (sk-...)" 
                  type="password"
                  className={`h-[42px] w-full ${errors.providedKey ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.providedKey && <span className="text-xs text-red-500">{errors.providedKey.message}</span>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button 
            variant="white"
            onClick={handleClose}
            type="button"
            className="h-[42px] px-5 rounded-xl font-medium"
          >
            Hủy
          </Button>
          <Button 
            type="submit"
            className="bg-indigo-600 text-white h-[42px] px-6 rounded-xl font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2" 
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Đang lưu...' : <><FaPlus /> Thêm Key</>}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
