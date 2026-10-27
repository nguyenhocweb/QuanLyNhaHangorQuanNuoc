import axiosClient from "@/src/core/api/axios-instance";
import { IAdminWebAuthor } from "../type/web_author_admin.type";

export const createAdminWebAuthorService = async (data: Partial<IAdminWebAuthor>): Promise<{ data: IAdminWebAuthor }> => {
  return await axiosClient.post("/system-admin/web-author", data);
};

