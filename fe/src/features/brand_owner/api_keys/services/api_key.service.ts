import axiosClient from "@/src/core/api/axios-instance";
import { CreateApiKeyPayload, CreateApiKeyResponse } from "../types/api_key.type";

export const getBrandApiKeysService = async (brandId: string, params: any) => {
  const { data } = await axiosClient.get(`/brand-owner/${brandId}/api-key`, { params });
  return data;
};

export const createBrandApiKeyService = async (brandId: string, payload: CreateApiKeyPayload) => {
  const { data } = await axiosClient.post(`/brand-owner/${brandId}/api-key`, payload);
  return data.metadata as CreateApiKeyResponse;
};

export const revokeBrandApiKeyService = async (brandId: string, id: string) => {
  const { data } = await axiosClient.post(`/brand-owner/${brandId}/api-key/${id}/revoke`);
  return data;
};

export const activateBrandApiKeyService = async (brandId: string, id: string) => {
  const { data } = await axiosClient.post(`/brand-owner/${brandId}/api-key/${id}/activate`);
  return data;
};

export const updateBrandApiKeyService = async (brandId: string, id: string, payload: any) => {
  const { data } = await axiosClient.put(`/brand-owner/${brandId}/api-key/${id}`, payload);
  return data;
};
