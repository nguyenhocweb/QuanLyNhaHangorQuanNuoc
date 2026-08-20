export interface IPublicRestaurantCore {
    id: string;
    name: string;
    logo?: string;
    imageMain: string;
    images: string[];
    phoneContact?: string;
    emailContact?: string;
    address: {
        street?: string;
        ward?: string;
        district?: string;
        province?: string;
    };
    description?: string;
    averageRating: number;
    totalRating: number;
    policies?: { name: string; description: string }[];
    social_links?: { platform: string; url: string }[];
    faqs?: { question: string; answer: string }[];
    delivery_partners?: { name: string; url: string; icon?: string }[];
    maxPartySize: number;
    bookingWindowDays: number;
    cancellationHours: number;
    depositRequired: boolean;
    depositPerPax?: number;
    brand?: {
        id: string;
        name: string;
        logo?: string;
    };
    template?: {
        code: string;
        type: string;
    };
    categories: {
        id: string;
        name: string;
        bgColor?: string;
        textColor?: string;
    }[];
    tags: {
        id: string;
        name: string;
        textColor?: string;
        bgColor?: string;
    }[];
    amenities: {
        id: string;
        name: string;
        icon?: string;
    }[];
}

export interface IOperatingHour {
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
    break_start?: string;
    break_end?: string;
}

export interface IPublicHoursData {
    operating_hours: IOperatingHour[];
    special_schedules?: any[];
}

export interface IPublicMenuItem {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    images: string[];
    price: number;
    is_featured: boolean;
    allergens: string | null;
    spice_level: number;
    prep_time: number | null;
    variants?: {
        id: string;
        name: string;
        price: number;
    }[];
    // Các trường bổ sung khi fetch trực tiếp menu-items
    menuName?: string;
    categoryName?: string;
}

export interface IPublicMenuItemResponse {
    data: IPublicMenuItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IPublicMenuCategory {
    id: string;
    name: string;
    description?: string;
    items: IPublicMenuItem[];
}

export interface IPublicMenu {
    id: string;
    name: string;
    description?: string;
    menucategory: IPublicMenuCategory[];
}

export interface IPublicReview {
    id: string;
    overall_rating: number;
    food_rating?: number;
    service_rating?: number;
    ambiance_rating?: number;
    comment?: string;
    staff_response?: string;
    images?: string[];
    helpful_count?: number;
    createdAt: string;
    user: {
        name: string;
        avatar?: string;
    }
}
