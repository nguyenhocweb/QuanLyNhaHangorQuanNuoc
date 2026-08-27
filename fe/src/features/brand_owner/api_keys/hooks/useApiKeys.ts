import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBrandApiKeysService, createBrandApiKeyService, revokeBrandApiKeyService, activateBrandApiKeyService, updateBrandApiKeyService, getActiveBrandAiChatboxesService, getActiveBrandAiModelsService } from '../services/api_key.service';
import { CreateApiKeyPayload } from '../types/api_key.type';
import { ApiKeyUpdateValues } from '../schema/api_key.update.schema';

export const useGetApiKeys = (brandId: string | undefined, page = 1, limit = 10, search = '', status = '') => {
  return useQuery({
    queryKey: ['brand_api_keys', brandId, page, limit, search, status],
    queryFn: () => getBrandApiKeysService(brandId!, { page, limit, search, status }),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};

export const useGetActiveBrandAiChatboxes = (brandId: string | undefined) => {
  return useQuery({
    queryKey: ['brand_active_ai_chatboxes', brandId],
    queryFn: () => getActiveBrandAiChatboxesService(brandId!),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};

export const useGetActiveBrandAiModels = (brandId: string | undefined, chatboxId?: string) => {
  return useQuery({
    queryKey: ['brand_active_ai_models', brandId, chatboxId],
    queryFn: () => getActiveBrandAiModelsService(brandId!, chatboxId),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, payload }: { brandId: string, payload: CreateApiKeyPayload }) => 
      createBrandApiKeyService(brandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand_api_keys'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi tạo API Key");
    }
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, id }: { brandId: string, id: string }) => 
      revokeBrandApiKeyService(brandId, id),
    onSuccess: () => {
      toast.success("Đã thu hồi API Key thành công");
      queryClient.invalidateQueries({ queryKey: ['brand_api_keys'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi thu hồi API Key");
    }
  });
};

export const useActivateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, id }: { brandId: string, id: string }) => 
      activateBrandApiKeyService(brandId, id),
    onSuccess: () => {
      toast.success("Đã kích hoạt lại API Key thành công");
      queryClient.invalidateQueries({ queryKey: ['brand_api_keys'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi kích hoạt lại API Key");
    }
  });
};

export const useUpdateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ brandId, id, payload }: { brandId: string, id: string, payload: ApiKeyUpdateValues }) => 
      updateBrandApiKeyService(brandId, id, payload),
    onSuccess: () => {
      toast.success("Đã cập nhật API Key thành công");
      queryClient.invalidateQueries({ queryKey: ['brand_api_keys'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật API Key");
    }
  });
};
