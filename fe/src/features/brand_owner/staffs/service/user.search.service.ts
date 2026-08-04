import axiosClient from "@/src/core/api/axios-instance";

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  sdt?: string;
  avatar?: string;
}

export const searchUserService = async (brandId: string, keyword: string) => {
  const { data } = await axiosClient.get(`/brand-owner/${brandId}/user/search`, {
    params: { keyword },
  });
  return data.data as UserSearchResult[];
};
