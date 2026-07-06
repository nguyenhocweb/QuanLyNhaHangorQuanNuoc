import { RestaurantCardResponseType } from "@/src/features/public/restaurant/restaurant_type/restaurant_card_type";

export interface Brand {
    id: string;
    name: string;
    logo?: string;
    email_contact?: string;
    phone_contact?: string;
    description?: string;
    tax_code?: string;
    link?: string;
    imageMain?: string;
    images: string[];
    isActive: "ACTIVE" | "PENDING" | "INACTIVE" | "TERMINATED";
    reason?: string;
    address?: {
        street?: string;
        ward?: string;
        wardCode?: string;
        district?: string;
        districtCode?: string;
        province?: string;
        provinceCode?: string;
    };
    isFeatured: boolean;
    isNew: boolean;
    restaurantCount: number;
    subscriptions?: {
        plan: {
            name: string;
            price: number;
        }
    }[];
    restaurants: any[];
    employments?: {
        user: {
            id: string;
            name: string;
            email: string;
            sdt: string;
            avatar?: string;
        }
    }[];
    createdAt: string;
    updatedAt: string;
}
