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
    trialPeriodDays: number;
    setupFee: number;
    featuresData: Record<string, any> | null;
    isPublic: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
