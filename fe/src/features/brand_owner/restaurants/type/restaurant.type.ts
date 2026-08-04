export interface RestaurantTypeResponse {
    id: string;
    brandId: string;
    logo?: string;
    name?: string;
    isNew?: boolean;
    address?: {
        street?: string;
        city?: string;
        district?: string;
        ward?: string;
    };
    email_contact?: string;
    phone_contact?: string;
    description?: string;
    statusByBrand: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    statusByAdmin: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    imageMain: string;
    images: string[];
    averageRating: number;
    totalRating: number;
    average_food_rating?: number;
    average_service_rating?: number;
    average_ambiance_rating?: number;
    max_party_size?: number;
    booking_window_days?: number;
    deposit_required?: boolean;
    deposit_amount?: number;
    createdAt: string;
    updatedAt: string;
    categories?: {
        id: string;
        name: string;
        color?: string;
    }[];
    tags?: {
        id: string;
        name: string;
        color?: string;
    }[];
    amenities?: {
        id: string;
        name: string;
        icon?: string;
    }[];
}
