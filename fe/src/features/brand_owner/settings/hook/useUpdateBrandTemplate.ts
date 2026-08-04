import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrandTemplateService } from "../service/settings.update_brand_template.service";
import { toast } from "sonner";

export const useUpdateBrandTemplate_hook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (templateId: string) => {
            return await updateBrandTemplateService(templateId);
        },
        onSuccess: (data) => {
            toast.success(data.message || "Cập nhật mẫu giao diện thành công!");
            // Invalidate My Brand
            queryClient.invalidateQueries({ queryKey: ["myBrand"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Cập nhật mẫu giao diện thất bại.");
        }
    });
};
