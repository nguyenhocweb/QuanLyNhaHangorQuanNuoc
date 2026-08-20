import { RestaurantCardResponseType } from "@/src/features/public/restaurant/restaurant_type/restaurant_card_type";

export interface Brand {
    id: string;
    name: string;
    logo?: string;
    emailContact?: string;
    phoneContact?: string;
    description?: string;
    taxCode?: string;
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
    restaurantCount?: number;
    inventoryApprovalThreshold?: number;

    // Tax & Fee
    isVatInclusive?: boolean;
    defaultVatRate?: number;
    serviceChargeRate?: number;
    applyServiceCharge?: boolean;
    forceGlobalTaxConfig?: boolean;
    templateId?: string;
    template?: {
        code: string;
    };
    subscriptions?: {
        plan: {
            name: string;
            price: number;
            maxRestaurants: number;
        }
    }[];
    restaurants: {
        id: string;
        name: string;
        imageMain?: string;
        address?: {
            street?: string;
            ward?: string;
            district?: string;
            province?: string;
        };
        averageRating?: number;
        categories?: { name: string }[];
        tags?: { name: string }[];
        createdAt: string;
    }[];
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
