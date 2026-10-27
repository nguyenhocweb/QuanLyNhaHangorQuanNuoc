import axiosClient from "@/src/core/api/axios-instance";
import { IAdminContactTicket } from "../type/contact_ticket_admin.type";

export const updateAdminContactTicketService = async (
  id: string,
  payload: Partial<IAdminContactTicket>
): Promise<{ message: string; data: IAdminContactTicket }> => {
  const response = await axiosClient.patch(`/system-admin/contact-ticket/${id}`, payload);
  return response.data;
};
