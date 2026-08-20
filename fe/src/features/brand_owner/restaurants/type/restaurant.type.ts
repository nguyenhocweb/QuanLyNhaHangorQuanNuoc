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
    emailContact?: string;
    phoneContact?: string;
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
    maxPartySize?: number;
    bookingWindowDays?: number;
    depositRequired?: boolean;
    depositPerPax?: number;
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
