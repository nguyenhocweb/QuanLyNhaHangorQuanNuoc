import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiKeysService, createApiKeyService, revokeApiKeyService, getActiveAiChatboxesService, getActiveAiModelsService, activateApiKeyService, updateApiKeyService } from "../service/api_key.service";
import { toast } from "sonner";

export const useGetActiveAiChatboxes = () => {
  return useQuery({
    queryKey: ['system_active_ai_chatboxes'],
    queryFn: getActiveAiChatboxesService,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const useGetActiveAiModels = (chatboxId?: string) => {
  return useQuery({
    queryKey: ['system_active_ai_models', chatboxId],
    queryFn: () => getActiveAiModelsService(chatboxId),
    enabled: !!chatboxId,
    staleTime: 5 * 60 * 1000
  });
};

export const useGetApiKeys = (params?: any) => {
  return useQuery({
    queryKey: ['system_api_keys', params],
    queryFn: () => getApiKeysService(params),
    staleTime: 60 * 1000
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApiKeyService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_api_keys'] });
      toast.success("Thêm API Key thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thêm API Key");
    }
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeApiKeyService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_api_keys'] });
      toast.success("Đã thu hồi API Key thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi thu hồi API Key");
    }
  });
};

export const useActivateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateApiKeyService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_api_keys'] });
      toast.success("Đã kích hoạt lại API Key thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi kích hoạt lại API Key");
    }
  });
};

export const useUpdateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => updateApiKeyService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_api_keys'] });
      toast.success("Đã cập nhật API Key thành công");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi cập nhật API Key");
    }
  });
};
