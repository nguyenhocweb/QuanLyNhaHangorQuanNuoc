export interface ITemplate {
    id: string;
    name: string;
    code: string;
    type: "BRAND_TEMPLATE" | "RESTAURANT_TEMPLATE";
    thumbnailUrl: string | null;
    description: string | null;
    desktopImages: string[];
    mobileImages: string[];
    tabletImages: string[];
    isActive: boolean;
    allowedPlanIds: string[];
    isUnlocked: boolean; // Field from backend
}
