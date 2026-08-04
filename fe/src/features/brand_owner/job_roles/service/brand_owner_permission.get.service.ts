import axiosClient from "@/src/core/api/axios-instance";

export const getBrandOwnerPermissionsService = async (brandId: string) => {
  const { data } = await axiosClient.get(`/brand-owner/${brandId}/permission`);
  return data; // Expected { message, metadata: { BRAND: [...], RESTAURANT: [...] } }
};
