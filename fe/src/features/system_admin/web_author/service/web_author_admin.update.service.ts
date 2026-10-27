import axiosClient from "@/src/core/api/axios-instance";
import { IAdminWebAuthor } from "../type/web_author_admin.type";

export const updateAdminWebAuthorService = async (
  id: string,
  data: Partial<IAdminWebAuthor>
): Promise<{ data: IAdminWebAuthor }> => {
  return await axiosClient.patch(`/system-admin/web-author/${id}`, data);
};

