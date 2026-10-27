import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createContactTicketService } from "../service/contact_ticket.create.service";
import { ICreateContactTicketPayload, ICreateContactTicketResponse } from "../type/contact_ticket.type";

export const useCreateContactTicket = (
  onSuccessCallback?: (data: ICreateContactTicketResponse) => void
) => {
  return useMutation({
    mutationFn: (payload: ICreateContactTicketPayload) => createContactTicketService(payload),
    onSuccess: (res) => {
      toast.success("Gửi yêu cầu hỗ trợ thành công! Đội ngũ CSKH đã tiếp nhận.");
      if (onSuccessCallback && res?.data) {
        onSuccessCallback(res.data);
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Gửi yêu cầu hỗ trợ thất bại, vui lòng thử lại!";
      toast.error(msg);
    }
  });
};
