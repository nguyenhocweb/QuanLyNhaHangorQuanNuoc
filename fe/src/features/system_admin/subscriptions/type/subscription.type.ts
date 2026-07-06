export interface SubscriptionPlan {
    id: string;
    name: string;
    description?: string;
    price: number;
    discountPrice?: number;
    discountStartDate?: string;
    discountEndDate?: string;
    billingCycle: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
    maxRestaurants: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
