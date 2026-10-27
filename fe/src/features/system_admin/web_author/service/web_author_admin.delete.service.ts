import axiosClient from "@/src/core/api/axios-instance";

export const deleteAdminWebAuthorService = async (id: string) => {
  return await axiosClient.delete(`/system-admin/web-author/${id}`);
};

