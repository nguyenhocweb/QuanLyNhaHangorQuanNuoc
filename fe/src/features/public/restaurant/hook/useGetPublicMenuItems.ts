import { useQuery } from "@tanstack/react-query";
import { getPublicMenuItemsService } from "../service/restaurant_menu_items.get.service";

interface Params {
    restaurantId: string;
    page: number;
    limit: number;
    search?: string;
    menuId?: string;
    categoryId?: string;
}

export const useGetPublicMenuItems = (params: Params) => {
    return useQuery({
        queryKey: ["public_restaurant_menu_items", params.restaurantId, params.page, params.limit, params.search, params.menuId, params.categoryId],
        queryFn: async () => {
            if (!params.restaurantId) return null;
            
            // Lọc bỏ params có giá trị "all" hoặc trống để không truyền lên BE
            const cleanParams: any = { restaurantId: params.restaurantId, page: params.page, limit: params.limit };
            if (params.search) cleanParams.search = params.search;
            if (params.menuId && params.menuId !== "all") cleanParams.menuId = params.menuId;
            if (params.categoryId && params.categoryId !== "all") cleanParams.categoryId = params.categoryId;
            
            const response = await getPublicMenuItemsService(cleanParams);
            return response.metadata;
        },
        enabled: !!params.restaurantId,
        staleTime: 60 * 1000,
    });
};
