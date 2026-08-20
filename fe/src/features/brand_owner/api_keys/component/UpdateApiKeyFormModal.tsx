import React, { useEffect } from 'react';
import { Modal } from '@/src/core/components/layout/public-Modal';
import { Button, Input, P } from '@/src/core/components/ui';
import { FaSave } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiKeyUpdateSchema, ApiKeyUpdateValues } from '../schema/api_key.update.schema';
import { useUpdateApiKey } from '../hooks/useApiKeys';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetActiveAiModels } from '@/src/features/system_admin/api_keys/hook/useApiKeys';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiKey: any;
}

export const UpdateApiKeyFormModal: React.FC<Props> = ({ isOpen, onClose, apiKey }) => {
  const { activeWorkspace } = useAuthStore();
  const brandId = activeWorkspace?.id;
  const updateMutation = useUpdateApiKey();
  
  // Chúng ta chỉ lấy danh sách model cho chatbox của key này
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

  // Khởi tạo dữ liệu khi mở form
  useEffect(() => {
    if (isOpen && apiKey) {
      reset({
        name: apiKey.name || '',
        contactEmail: apiKey.contactEmail || '',
        restrictedModelId: apiKey.restrictedModelId || ''
      });
    }
  }, [isOpen, apiKey, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ApiKeyUpdateValues) => {
    if (!brandId || !apiKey) return;

    const payload = {
      ...data,
      contactEmail: data.contactEmail || undefined,
      restrictedModelId: data.restrictedModelId || undefined
    };

    updateMutation.mutate(
      { brandId, id: apiKey.id, payload },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  if (!apiKey) return null;

  return (
    <Modal open={isOpen} onClose={handleClose} title="Cập nhật API Key">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-5">
        <P className="text-gray-500 text-sm">
          Bạn có thể thay đổi tên và giới hạn Model cho API Key này. Vì lý do bảo mật, bạn không thể xem hoặc sửa đổi mã Key thực tế tại đây.
        </P>

        <div className="flex flex-col w-full gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nhà cung cấp (Không thể thay đổi)</label>
            <Input 
              value={apiKey.chatbox?.name || 'Không xác định'} 
              disabled
              className="h-[42px] w-full bg-gray-100 text-gray-500"
            />
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
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Đang lưu...' : <><FaSave /> Lưu Thay Đổi</>}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
