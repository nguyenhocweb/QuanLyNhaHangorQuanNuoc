export interface Variant {
    id: string;
    name: string;
    price: number;
    sku?: string;
}

export interface ModifierOption {
    id: string;
    name: string;
    priceExtra: number;
}

export interface ModifierGroup {
    id: string;
    name: string;
    minSelections?: number;
    maxSelections?: number;
    options?: ModifierOption[];
}

export interface RestaurantMenuItemResponse {
    id: string;
    name: string;
    image?: string;
    basePrice: number;
    isAvailable: boolean;
    isActive?: boolean;
    overridePrice: number | null;
    restaurantMenuItemId: string | null;
    categoryMaps?: {
        category?: {
            id: string;
            name: string;
            menuMaps?: {
                menu?: {
                    id: string;
                    name: string;
                };
            }[];
        };
    }[];
    variants?: Variant[];
    modifierGroups?: ModifierGroup[];
}

export interface GetRestaurantMenuParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    menuId?: string;
    isAvailable?: string | boolean;
}

export interface MenuInfo {
    id: string;
    name: string;
}

export interface CategoryInfo {
    id: string;
    name: string;
    menuMaps?: {
        menuId: string;
    }[];
}

export interface GetRestaurantMenuResponse {
    message: string;
    metadata: {
        items: RestaurantMenuItemResponse[];
        categories: CategoryInfo[];
        menus: MenuInfo[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
