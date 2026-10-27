import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAdminContactTicketService } from "../service/contact_ticket.update.service";
import { IAdminContactTicket } from "../type/contact_ticket_admin.type";

export const useUpdateAdminContactTicket = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IAdminContactTicket> }) =>
      updateAdminContactTicketService(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật phiếu hỗ trợ thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_CONTACT_TICKETS"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Cập nhật phiếu hỗ trợ thất bại!";
      toast.error(msg);
    }
  });
};
