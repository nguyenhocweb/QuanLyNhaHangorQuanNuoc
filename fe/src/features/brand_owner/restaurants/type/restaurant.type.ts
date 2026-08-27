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
    bookingConfig?: {
        maxPartySize?: number;
        bookingWindowDays?: number;
        cancellationHours?: number;
        depositRequired?: boolean;
        depositAmount?: number;
    };
    ratingStats?: {
        totalRating?: number;
        averageRating?: number;
        food?: number;
        service?: number;
        ambiance?: number;
    };
    taxConfig?: {
        isVatInclusive?: boolean;
        defaultVatRate?: number;
        applyServiceCharge?: boolean;
        serviceChargeRate?: number;
        forceGlobalTaxConfig?: boolean;
    };
    inventoryConfig?: {
        inventoryApprovalThreshold?: number;
    };
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
