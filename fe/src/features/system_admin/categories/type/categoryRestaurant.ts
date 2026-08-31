export interface CategoryRestaurantTypeResponse {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    isActive: boolean;
    bgColor?: string;
    textColor?: string;
}

export interface PaginatedCategoryRestaurantType {
    data: CategoryRestaurantTypeResponse[];
    meta: {
        totalRecords: number;
        totalActive: number;
        totalInactive: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}