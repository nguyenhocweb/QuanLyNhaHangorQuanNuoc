import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTemplatesService, createTemplateService, updateTemplateService, deleteTemplateService } from "../service/template.service";
import { TemplateFormValues } from "../schema/template.schema";
import { ITemplateResponse } from "../type/template.type";
import { toast } from "sonner";

export const useGetTemplates = (type?: string) => {
    return useQuery<ITemplateResponse, Error>({
        queryKey: ["templates", type],
        queryFn: () => getTemplatesService({ type }),
        staleTime: 60 * 1000,
    });
};

export const useCreateTemplate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: TemplateFormValues) => createTemplateService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
            toast.success("Thêm mẫu giao diện thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm mẫu giao diện!");
        }
    });
};

export const useUpdateTemplate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: { id: string; payload: TemplateFormValues }) => updateTemplateService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
            toast.success("Cập nhật mẫu giao diện thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật mẫu giao diện!");
        }
    });
};

export const useDeleteTemplate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteTemplateService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
            toast.success("Xóa mẫu giao diện thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa mẫu giao diện!");
        }
    });
};
