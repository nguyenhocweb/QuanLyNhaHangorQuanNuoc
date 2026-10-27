import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAdminContactTicketService } from "../service/contact_ticket.delete.service";

export const useDeleteAdminContactTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminContactTicketService(id),
    onSuccess: () => {
      toast.success("Xóa phiếu hỗ trợ thành công!");
      queryClient.invalidateQueries({ queryKey: ["ADMIN_CONTACT_TICKETS"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Xóa phiếu hỗ trợ thất bại!";
      toast.error(msg);
    }
  });
};
