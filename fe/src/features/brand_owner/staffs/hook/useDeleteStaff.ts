import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteStaffService } from "../service/staff.delete.service";

export const useDeleteStaff = (brandId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (staffId: string) => deleteStaffService(brandId, staffId),
        onSuccess: () => {
            toast.success("Xóa nhân viên thành công!");
            queryClient.invalidateQueries({ queryKey: ["staffs", brandId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa nhân viên");
        }
    });
};
