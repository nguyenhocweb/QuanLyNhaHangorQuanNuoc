import axiosClient from "@/src/core/api/axios-instance";
import { IGetContactTicketsQuery, IContactTicketsResponse } from "../type/contact_ticket_admin.type";

export const getAdminContactTicketsService = async (
  query: IGetContactTicketsQuery
): Promise<{ message: string; data: IContactTicketsResponse }> => {
  const response = await axiosClient.get("/system-admin/contact-ticket", {
    params: query
  });
  return response.data;
};
