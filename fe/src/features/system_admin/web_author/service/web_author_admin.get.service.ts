import axiosClient from "@/src/core/api/axios-instance";
import { IAdminWebAuthor } from "../type/web_author_admin.type";

export const getAdminWebAuthorsService = async (): Promise<IAdminWebAuthor[]> => {
  const res = await axiosClient.get("/system-admin/web-author");
  return res.data?.data || [];
};
