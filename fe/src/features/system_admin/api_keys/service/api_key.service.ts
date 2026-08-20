import axiosClient from "@/src/core/api/axios-instance";
import { ApiKeysResponse, ApiKey, AiChatbox, AiModel } from "../type/api_key.type";
import { ApiKeyFormValues } from "../schema/api_key.schema";

export const getApiKeysService = async (params?: any): Promise<{ metadata: ApiKeysResponse }> => {
  const { data } = await axiosClient.get("/system-admin/api-keys", { params });
  return data;
};

export const createApiKeyService = async (payload: ApiKeyFormValues): Promise<{ metadata: ApiKey }> => {
  const { data } = await axiosClient.post("/system-admin/api-keys", payload);
  return data;
};

export const revokeApiKeyService = async (id: string): Promise<any> => {
  const { data } = await axiosClient.post(`/system-admin/api-keys/${id}/revoke`);
  return data;
};

export const activateApiKeyService = async (id: string): Promise<any> => {
  const { data } = await axiosClient.post(`/system-admin/api-keys/${id}/activate`);
  return data;
};

export const updateApiKeyService = async (id: string, payload: any): Promise<any> => {
  const { data } = await axiosClient.put(`/system-admin/api-keys/${id}`, payload);
  return data;
};

export const getActiveAiChatboxesService = async (): Promise<{ metadata: AiChatbox[] }> => {
  const { data } = await axiosClient.get("/system-admin/ai-chatboxes/active");
  return data;
};

export const getActiveAiModelsService = async (chatboxId?: string): Promise<{ metadata: AiModel[] }> => {
  const { data } = await axiosClient.get("/system-admin/ai-models/active", { params: { chatboxId } });
  return data;
};
