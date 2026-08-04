export type BrandTemplateTheme = "standard" | "premium3d" | "luxury" | "vibrant" | string;

export interface ITemplateConfig {
    code: string;
    name: string;
    color: string;
}

export const BRAND_TEMPLATES: ITemplateConfig[] = [
    { code: "premium3d", name: "Cao cấp 3D", color: "bg-blue-600" },
    { code: "standard", name: "Tiêu chuẩn ", color: "bg-gray-500" },
    { code: "luxury", name: "Sang trọng", color: "bg-yellow-600" },
    { code: "vibrant", name: "Sôi động", color: "bg-pink-500" },
];

export const RESTAURANT_TEMPLATES: ITemplateConfig[] = [
    { code: "REST_DEFAULT", name: "Tiêu chuẩn (Mặc định)", color: "bg-gray-500" },
    { code: "REST_LUXURY", name: "Sang trọng", color: "bg-yellow-600" },
];
