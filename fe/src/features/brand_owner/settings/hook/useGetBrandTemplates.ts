import { useQuery } from "@tanstack/react-query";
import { getBrandTemplatesService } from "../service/settings.get_templates.service";

export const useGetBrandTemplates_hook = () => {
    return useQuery({
        queryKey: ["BrandSettingsTemplates"],
        queryFn: async () => {
            const response = await getBrandTemplatesService();
            return response?.metadata ?? null;
        },
        staleTime: 60 * 1000, // 1 phút
    });
};
