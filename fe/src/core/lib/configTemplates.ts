export type BrandTemplateTheme = "standard" | "premium3d" | "luxury" | "vibrant" | "zen" | string;

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
    { code: "zen", name: "Thiền / Chay (Zen)", color: "bg-lime-700" },
];

export const RESTAURANT_TEMPLATES: ITemplateConfig[] = [
    { code: "REST_DEFAULT", name: "Tiêu chuẩn (Mặc định)", color: "bg-gray-500" },
    { code: "REST_LUXURY", name: "Sang trọng", color: "bg-yellow-600" },
    { code: "REST_IMMERSIVE", name: "Không gian chiều sâu (3D/2D)", color: "bg-indigo-500" },
    { code: "REST_ZEN", name: "Thiền / Chay (Zen)", color: "bg-green-600" },
    { code: "REST_CAFE", name: "Quán Cafe", color: "bg-amber-700" },
    { code: "REST_ICECREAM", name: "Cửa hàng kem", color: "bg-pink-400" },
    { code: "REST_HOTPOT", name: "Lẩu & Nướng", color: "bg-red-500" },
    { code: "REST_SUSHI", name: "Nhà hàng Sushi (Premium)", color: "bg-red-800" },
];
