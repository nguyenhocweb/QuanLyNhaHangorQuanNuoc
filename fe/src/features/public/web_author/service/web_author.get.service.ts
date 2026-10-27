import axiosClient from "@/src/core/api/axios-instance";
import { IWebAuthor } from "../type/web_author.type";

export const getPublicWebAuthorsService = async (): Promise<IWebAuthor[]> => {
  const res = await axiosClient.get("/public/web-author");
  return res.data?.data || [];
};
