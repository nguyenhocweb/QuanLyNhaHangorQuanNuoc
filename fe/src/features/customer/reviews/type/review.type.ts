export interface User {
    id: string;
    name: string;
    avatar?: string;
}

export interface RestaurantInfo {
    id: string;
    name: string;
    logo?: string;
    address?: {
        street?: string;
        ward?: string;
        district?: string;
        province?: string;
    };
    imageMain?: string;
}

export interface ReservationInfo {
    id: string;
    reservation_date: string;
    start_time: string;
    party_size: number;
    confirmation_code: string;
}

export interface Review {
    id: string;
    reservationId: string;
    userId: string;
    user?: User;
    restaurantId: string;
    restaurant?: RestaurantInfo;
    reservation?: ReservationInfo;
    overall_rating: number;
    food_rating?: number;
    service_rating?: number;
    ambiance_rating?: number;
    comment?: string;
    images: string[];
    helpful_count: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED_SPAM';
    staff_response?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    helpfulCount: number;
    unreviewedCount: number;
}

export interface UnreviewedMealItem {
    id: string;
    confirmation_code: string;
    reservation_date: string;
    start_time: string;
    party_size: number;
    restaurant: RestaurantInfo;
}

export interface GetReviewsResponse {
    reviews: Review[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface GetMyReviewsResponse {
    reviews: Review[];
    stats: ReviewStats;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface GetUnreviewedResponse {
    meals: UnreviewedMealItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
