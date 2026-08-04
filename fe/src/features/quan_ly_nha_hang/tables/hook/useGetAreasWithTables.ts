import { useQuery } from "@tanstack/react-query";
import { getAreasWithTablesService } from "../service/table.get.service";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

export const useGetAreasWithTables = () => {
    const { activeWorkspace } = useAuthStore();
    const restaurantId = activeWorkspace?.id;

    return useQuery({
        queryKey: ["areas-with-tables", restaurantId],
        queryFn: () => getAreasWithTablesService(restaurantId!),
        enabled: !!restaurantId,
        staleTime: 10 * 1000, // 10 giây (vì trạng thái bàn thay đổi liên tục)
    });
};
