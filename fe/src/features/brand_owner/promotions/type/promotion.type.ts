export interface Promotion {
    id: string;
    code: string;
    description?: string;
    discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
    discount_value: number;
    min_order_value?: number;
    max_discount?: number;
    valid_from: string;
    valid_until: string;
    usage_limit?: number;
    used_count: number;
    image?: string;
    brandId?: string;
    restaurantId?: string;
    isActive: boolean;
    createdAt: string;
}

export interface GetPromotionsResponse {
    items: Promotion[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
