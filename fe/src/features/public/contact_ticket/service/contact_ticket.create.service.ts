import axiosClient from "@/src/core/api/axios-instance";
import { ICreateContactTicketPayload, ICreateContactTicketResponse } from "../type/contact_ticket.type";

export const createContactTicketService = async (
  payload: ICreateContactTicketPayload
): Promise<{ message: string; data: ICreateContactTicketResponse }> => {
  const response = await axiosClient.post("/public/contact-ticket", payload);
  return response.data;
};
