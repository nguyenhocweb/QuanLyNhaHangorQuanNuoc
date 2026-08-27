import React from 'react';
import { Modal } from '@/src/core/components/layout/public-Modal';
import { Button, Input, P } from '@/src/core/components/ui';
import { FaPlus } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiKeyCreateSchema, ApiKeyCreateValues } from '../schema/api_key.create.schema';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useCreateApiKey, useGetActiveBrandAiChatboxes, useGetActiveBrandAiModels } from '../hooks/useApiKeys';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateApiKeyFormModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { activeWorkspace } = useAuthStore();
  const brandId = activeWorkspace?.id;
  const createMutation = useCreateApiKey();
  const { data: chatboxesData, isLoading: isLoadingChatboxes } = useGetActiveBrandAiChatboxes(brandId);
  
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<ApiKeyCreateValues>({
    resolver: zodResolver(apiKeyCreateSchema) as any,
    defaultValues: {
      name: '',
      providedKey: '',
      chatboxId: '',
      contactEmail: '',
      restrictedModelId: ''
    }
  });

  const chatboxIdValue = watch('chatboxId');
  const { data: modelsData, isLoading: isLoadingModels } = useGetActiveBrandAiModels(brandId, chatboxIdValue);

  const chatboxes = chatboxesData?.metadata || [];
  const models = modelsData?.metadata || [];

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ApiKeyCreateValues) => {
    if (!brandId) return;

    const payload = {
      ...data,
      contactEmail: data.contactEmail || undefined,
      restrictedModelId: data.restrictedModelId || undefined
    };

    createMutation.mutate(
      { brandId, payload },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title="Thêm API Key mới">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-5">
        <P className="text-gray-500 text-sm">
          Thêm khóa API để kết nối Thương hiệu của bạn với các mô hình AI. Khóa này chỉ có tác dụng trong phạm vi thương hiệu của bạn.
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
                  placeholder="Email của người quản lý key" 
                  className={`h-[42px] w-full ${errors.contactEmail ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.contactEmail && <span className="text-xs text-red-500">{errors.contactEmail.message}</span>}
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
