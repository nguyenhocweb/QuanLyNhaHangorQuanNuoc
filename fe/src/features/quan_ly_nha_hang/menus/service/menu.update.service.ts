import axiosClient from "@/src/core/api/axios-instance";
import { MenuUpdateFormValues } from "../schema/menu.update.schema";

export const updateRestaurantMenuService = async ({
    restaurantId,
    menuItemId,
    data
}: {
    restaurantId: string;
    menuItemId: string;
    data: MenuUpdateFormValues;
}): Promise<any> => {
    const response = await axiosClient.patch(
        `/restaurant-manager/menu/${menuItemId}`,
        data,
        {
            params: { restaurantId }
        }
    );
    return response.data;
};
