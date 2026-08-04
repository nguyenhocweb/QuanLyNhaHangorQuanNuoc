export interface ITemplate {
    id: string;
    name: string;
    code: string;
    type: "BRAND_TEMPLATE" | "RESTAURANT_TEMPLATE";
    thumbnailUrl: string | null;
    description: string | null;
    desktopImages: string[];
    tabletImages: string[];
    mobileImages: string[];
    isActive: boolean;
    allowedPlanIds: string[];
    createdAt: string;
    updatedAt: string;
}

// Nếu có phân trang
export interface ITemplateResponse {
    message: string;
    metadata: ITemplate[];
    // Có thể thêm phân trang nếu API trả về sau này
}
