import React from "react";
import { cn } from "@/src/core/lib/tw";

interface Props {
    activeTab: string;
    onChangeTab: (tab: "INTRO" | "GALLERY" | "CATEGORIES" | "PROMOTIONS" | "MENU" | "AMENITIES" | "HOURS" | "LOCATION" | "POLICIES" | "REVIEWS") => void;
    reviewCount: number;
    variant?: 'default' | 'luxury';
}

const NavigationTabs: React.FC<Props> = ({ activeTab, onChangeTab, reviewCount, variant = 'default' }) => {
    const tabs = [
        { id: "INTRO", label: "Giới thiệu chung" },
        { id: "GALLERY", label: "Không gian" },
        { id: "CATEGORIES", label: "Danh mục" },
        { id: "PROMOTIONS", label: "Khuyến mãi" },
        { id: "MENU", label: "Thực đơn" },
        { id: "AMENITIES", label: "Tiện ích" },
        { id: "HOURS", label: "Giờ hoạt động" },
        { id: "LOCATION", label: "Vị trí" },
        { id: "POLICIES", label: "Chính sách" },
        { id: "REVIEWS", label: `Đánh giá (${reviewCount})` },
    ];

    const isLuxury = variant === 'luxury';

    return (
        <div className={cn(
            "w-full transition-all",
            !isLuxury && "sticky top-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onChangeTab(tab.id as any)}
                            className={cn(
                                "whitespace-nowrap py-5 px-2 font-bold text-sm transition-all border-b-2",
                                activeTab === tab.id 
                                ? (isLuxury ? "border-yellow-600 text-yellow-600" : "border-indigo-600 text-indigo-600")
                                : (isLuxury ? "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-[#333]" : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300")
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NavigationTabs;
