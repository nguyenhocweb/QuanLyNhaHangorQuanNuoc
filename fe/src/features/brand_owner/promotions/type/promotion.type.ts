export interface Promotion {
    id: string;
    code: string;
    description?: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number;
    validFrom: string;
    validUntil: string;
    usageLimit?: number;
    usedCount: number;
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
