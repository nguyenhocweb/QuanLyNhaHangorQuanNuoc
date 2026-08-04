import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStaffService } from "../service/staff.update.service";
import { UpdateStaffFormValues } from "../schema/staff.update.schema";

export const useUpdateStaff = (brandId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ staffId, data }: { staffId: string, data: UpdateStaffFormValues }) => updateStaffService(brandId, staffId, data),
        onSuccess: () => {
            toast.success("Cập nhật nhân viên thành công!");
            queryClient.invalidateQueries({ queryKey: ["staffs", brandId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật nhân viên");
        }
    });
};
