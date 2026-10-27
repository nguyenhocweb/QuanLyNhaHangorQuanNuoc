import { useQuery } from "@tanstack/react-query";
import { getAdminContactTicketsService } from "../service/contact_ticket.get.service";
import { IGetContactTicketsQuery } from "../type/contact_ticket_admin.type";

export const useGetAdminContactTickets = (query: IGetContactTicketsQuery) => {
  return useQuery({
    queryKey: ["ADMIN_CONTACT_TICKETS", query],
    queryFn: () => getAdminContactTicketsService(query),
    staleTime: 60 * 1000
  });
};
