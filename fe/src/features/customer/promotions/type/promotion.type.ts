export interface RestaurantBasic {
    id: string;
    name: string;
    logo?: string;
    address?: any;
    imageMain?: string;
}

export interface BrandBasic {
    id: string;
    name: string;
    logo?: string;
}

export interface Promotion {
    id: string;
    code: string;
    description?: string;
    discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
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
    restaurant?: RestaurantBasic | null;
    brand?: BrandBasic | null;
    isSaved?: boolean;
}

export interface WalletItem {
    id: string;
    userId: string;
    promotionId: string;
    isUsed: boolean;
    usedAt?: string;
    savedAt: string;
    promotion: Promotion;
}

export interface WalletStats {
    totalSaved: number;
    activeCount: number;
    expiringSoonCount: number;
    usedCount: number;
}

export interface WalletResponse {
    items: WalletItem[];
    stats: WalletStats;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface DiscoverResponse {
    items: Promotion[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
