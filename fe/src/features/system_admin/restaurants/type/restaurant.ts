export interface RestaurantTypeResponse {
    id: string;
    name?: string;
    logo?: string;
    address?: string;
    city?: string;
    email_contact?: string;
    phone_contact?: string;
    isActive: string; // 'ACTIVE' | 'INACTIVE'
    statusByAdmin?: string; // 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'TERMINATED'
    reasonByAdmin?: string;
    statusByBrand?: string; // 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'TERMINATED'
    categories?: {
        name: string;
        bgColor?: string;
        textColor?: string;
    }[];
    employments?: {
        user: {
            name: string;
            avatar?: string;
        }
    }[];
    brand?: {
        name: string;
    };
    totalRating?: number;
    averageRating?: number;
    createdAt: string;
}

export interface PaginatedRestaurantType {
    data: RestaurantTypeResponse[];
    meta: {
        totalRecords: number;
        totalActive: number;
        totalInactive: number;
        totalNew: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface CreateRestaurantProps {
    name: string;
    brandId?: string;
    address?: string;
    city?: string;
    email_contact?: string;
    phone_contact?: string;
    description?: string;
    max_party_size?: number | string;
    booking_window_days?: number | string;
    cancellation_hours?: number | string;
    deposit_required?: boolean;
    deposit_amount?: number | string;
    categoryIds?: string[];
    logo?: string;
    imageMain?: string;
    images?: string[];
    isActive?: boolean;
}

export interface UpdateRestaurantProps {
    id: string;
    name?: string;
    address?: string;
    city?: string;
    email_contact?: string;
    phone_contact?: string;
    isActive?: boolean;
    statusByAdmin?: string;
    reasonByAdmin?: string;
}
