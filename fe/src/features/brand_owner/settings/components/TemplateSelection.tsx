"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetBrandTemplates_hook } from "../hook/useGetBrandTemplates";
import { useUpdateBrandTemplate_hook } from "../hook/useUpdateBrandTemplate";
import { useUpdateRestaurantTemplate_hook } from "../hook/useUpdateRestaurantTemplate";
import { useGetMyBrand } from "../../my_brand/hook/useGetMyBrand";
import { useGetMyBrandRestaurants } from "../../my_brand/hook/useGetMyBrandRestaurants";
import { ITemplate } from "../type/settings.type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaLock, FaCheckCircle, FaCrown, FaEye } from "react-icons/fa";
import { FiLayout, FiSmartphone, FiMonitor, FiTablet, FiX } from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/src/core/lib/tw";
import { Button } from "@/src/core/components/ui";

const TemplateSelection = () => {
    const [activeTab, setActiveTab] = useState<"BRAND" | "RESTAURANT">("BRAND");
    const [previewTemplate, setPreviewTemplate] = useState<ITemplate | null>(null);
    const [previewDevice, setPreviewDevice] = useState<"DESKTOP" | "MOBILE" | "TABLET">("DESKTOP");
    
    const { data: templates = [], isLoading: isLoadingTemplates } = useGetBrandTemplates_hook();
    const { data: brandRes, isLoading: isLoadingBrand } = useGetMyBrand();
    const { data: restaurantsRes, isLoading: isLoadingRestaurants } = useGetMyBrandRestaurants();

    const { mutate: updateBrandTemplate, isPending: isUpdatingBrand } = useUpdateBrandTemplate_hook();
    const { mutate: updateRestaurantTemplate, isPending: isUpdatingRestaurant } = useUpdateRestaurantTemplate_hook();

    const currentBrandTemplateId: string | null = brandRes?.templateId ?? null;
    
    // Giả định áp dụng đồng loạt, lấy templateId của nhà hàng đầu tiên làm mốc
    const restaurants: any[] = Array.isArray(restaurantsRes) ? restaurantsRes : [];
    const currentRestaurantTemplateId: string | null = restaurants.length > 0 ? (restaurants[0]?.templateId ?? null) : null;

    const brandTemplates = (templates || []).filter(t => t.type === "BRAND_TEMPLATE");
    const restaurantTemplates = (templates || []).filter(t => t.type === "RESTAURANT_TEMPLATE");

    const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isApplyAllRestaurants, setIsApplyAllRestaurants] = useState<boolean>(true);
    const [selectedRestaurantIds, setSelectedRestaurantIds] = useState<string[]>([]);

    const handleApplyBrand = (id: string) => {
        updateBrandTemplate(id);
    };

    const handleApplyRestaurantClick = (id: string) => {
        setSelectedTemplateId(id);
        setIsApplyAllRestaurants(true);
        setSelectedRestaurantIds([]);
        setRestaurantModalOpen(true);
    };

    const handleConfirmApplyRestaurant = () => {
        if (!brandRes?.id || !selectedTemplateId) return;
        const payload: any = { brandId: brandRes.id, templateId: selectedTemplateId };
        
        if (!isApplyAllRestaurants) {
            if (selectedRestaurantIds.length === 0) {
                // If they chose specific but didn't select any, maybe fallback or show error? 
                // Let's just return to prevent error
                return;
            }
            payload.restaurantIds = selectedRestaurantIds;
        }
        
        updateRestaurantTemplate(payload);
        setRestaurantModalOpen(false);
    };

    if (isLoadingTemplates || isLoadingBrand || isLoadingRestaurants) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 font-medium">Đang tải kho giao diện...</p>
            </div>
        );
    }

    const renderTemplateGrid = (items: ITemplate[], currentId: string | null, onApply: (id: string) => void, isUpdating: boolean) => {
        if (items.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                    <FiLayout className="text-5xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Chưa có giao diện nào</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-sm">Hệ thống đang cập nhật thêm các mẫu giao diện mới, vui lòng quay lại sau.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full mt-6">
                {items.map((template) => {
                    const isCurrent = currentId === template.id;
                    const isLocked = !template.isUnlocked;

                    return (
                        <div key={template.id} className={cn(
                            "group relative flex flex-col bg-white rounded-[24px] overflow-hidden transition-all duration-500",
                            isCurrent ? "ring-2 ring-indigo-500 shadow-[0_8px_30px_rgb(99,102,241,0.15)]" : "border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1"
                        )}>
                            {/* Tags & Badges */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                {isCurrent && (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-full shadow-lg">
                                        <FaCheckCircle /> Đang sử dụng
                                    </span>
                                )}
                                {isLocked && (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-full shadow-lg">
                                        <FaCrown /> Premium
                                    </span>
                                )}
                            </div>

                            {/* Preview Button */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); setPreviewDevice("DESKTOP"); }}
                                className="absolute top-4 right-4 z-20 p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-indigo-600 shadow-lg transition-all duration-300"
                                title="Xem trước đa thiết bị"
                            >
                                <FaEye />
                            </button>

                            {/* Thumbnail Area */}
                            <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                                {template.thumbnailUrl ? (
                                    <Image 
                                        src={template.thumbnailUrl} 
                                        alt={template.name} 
                                        fill 
                                        className={cn(
                                            "object-cover transition-transform duration-700 group-hover:scale-110",
                                            isLocked ? "grayscale-[30%] opacity-80" : ""
                                        )}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                                        <FiMonitor className="text-4xl mb-2 opacity-50" />
                                        <span className="text-sm font-medium">Chưa có ảnh xem trước</span>
                                    </div>
                                )}
                                
                                {/* Overlay cho Locked */}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-center mx-4 shadow-2xl">
                                            <FaLock className="text-3xl mx-auto mb-3 text-white/90 drop-shadow-md" />
                                            <p className="text-sm font-medium text-white mb-5 drop-shadow-md">Gói cước của bạn không hỗ trợ mẫu này</p>
                                            <Link href="/brand_owner/billing">
                                                <button className="w-full py-2.5 px-4 rounded-xl border border-white/50 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                                                    Nâng cấp gói ngay
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Overlay cho Unlocked nhưng chưa dùng */}
                                {!isLocked && !isCurrent && (
                                    <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <button 
                                            className="py-3 px-6 rounded-xl bg-white text-gray-900 shadow-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100"
                                            disabled={isUpdating}
                                            onClick={() => onApply(template.id)}
                                        >
                                            Áp dụng ngay
                                        </button>
                                    </div>
                                )}

                                {/* Gradient Bottom Fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-0">
                                    <div className="flex gap-2">
                                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/10"><FiMonitor className="text-sm" /></div>
                                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/10"><FiTablet className="text-sm" /></div>
                                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/10"><FiSmartphone className="text-sm" /></div>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 flex flex-col flex-1 bg-white">
                                <h3 className="font-bold text-gray-900 text-xl line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                                    {template.description || "Giao diện hiện đại, chuyên nghiệp, tối ưu hiển thị trên mọi thiết bị và mang lại trải nghiệm tuyệt vời cho khách hàng."}
                                </p>
                                
                                <div className="flex items-center gap-3 mt-auto">
                                    <button 
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                                            isCurrent 
                                                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-1 ring-indigo-200" 
                                                : "bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-lg hover:-translate-y-0.5",
                                            (isLocked || isUpdating) ? "opacity-60 cursor-not-allowed hover:-translate-y-0 hover:shadow-md" : ""
                                        )}
                                        disabled={isLocked || isCurrent || isUpdating}
                                        onClick={() => onApply(template.id)}
                                    >
                                        {isCurrent ? <><FaCheckCircle /> Đang sử dụng</> : "Áp dụng mẫu này"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <FadeIn className="w-full flex flex-col gap-8">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold tracking-widest uppercase mb-4">
                        Thiết kế giao diện
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                        Tùy chỉnh diện mạo <br />thương hiệu của bạn
                    </h1>
                    <p className="text-indigo-200 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
                        Khám phá kho giao diện độc quyền. Lựa chọn mẫu phù hợp với phong cách của bạn để mang lại trải nghiệm tốt nhất cho khách hàng.
                    </p>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-full max-w-md mx-auto relative z-20">
                <button
                    onClick={() => setActiveTab("BRAND")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300",
                        activeTab === "BRAND" 
                        ? "bg-white text-indigo-700 shadow-md" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Giao diện Thương hiệu
                </button>
                <button
                    onClick={() => setActiveTab("RESTAURANT")}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300",
                        activeTab === "RESTAURANT" 
                        ? "bg-white text-indigo-700 shadow-md" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Giao diện Nhà hàng
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === "BRAND" && (
                    <FadeIn key="brand-tab">
                        <div className="mb-4 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Mẫu dành cho Trang chủ</h2>
                            <p className="text-gray-500 mt-2">Được tối ưu để hiển thị danh sách các chi nhánh và câu chuyện thương hiệu.</p>
                        </div>
                        {renderTemplateGrid(brandTemplates, currentBrandTemplateId, handleApplyBrand, isUpdatingBrand)}
                    </FadeIn>
                )}

                {activeTab === "RESTAURANT" && (
                    <FadeIn key="restaurant-tab">
                        <div className="mb-4 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Mẫu dành cho Chi nhánh</h2>
                            <p className="text-gray-500 mt-2">Được thiết kế tập trung vào thực đơn, đặt bàn và gọi món tại bàn.</p>
                            <div className="inline-block mt-4 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium">
                                Lựa chọn này sẽ áp dụng đồng loạt cho tất cả các nhà hàng thuộc hệ thống.
                            </div>
                        </div>
                        {renderTemplateGrid(restaurantTemplates, currentRestaurantTemplateId, handleApplyRestaurantClick, isUpdatingRestaurant)}
                    </FadeIn>
                )}
            </div>

            {/* Preview Modal Overlay */}
            {previewTemplate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[24px] overflow-hidden flex flex-col shadow-2xl">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FaEye className="text-indigo-500" /> Xem trước: {previewTemplate.name}
                            </h3>
                            
                            {/* Device Tabs */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                <button 
                                    onClick={() => setPreviewDevice("DESKTOP")}
                                    className={cn("p-2 sm:px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all", previewDevice === "DESKTOP" ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700")}
                                >
                                    <FiMonitor className="text-lg" /> <span className="hidden sm:inline">Máy tính</span>
                                </button>
                                <button 
                                    onClick={() => setPreviewDevice("TABLET")}
                                    className={cn("p-2 sm:px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all", previewDevice === "TABLET" ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700")}
                                >
                                    <FiTablet className="text-lg" /> <span className="hidden sm:inline">Máy tính bảng</span>
                                </button>
                                <button 
                                    onClick={() => setPreviewDevice("MOBILE")}
                                    className={cn("p-2 sm:px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all", previewDevice === "MOBILE" ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700")}
                                >
                                    <FiSmartphone className="text-lg" /> <span className="hidden sm:inline">Điện thoại</span>
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setPreviewTemplate(null)} 
                                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        
                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-10 flex flex-col items-center">
                            {(() => {
                                const images = previewDevice === "DESKTOP" ? (previewTemplate.desktopImages || []) 
                                             : previewDevice === "TABLET" ? (previewTemplate.tabletImages || [])
                                             : (previewTemplate.mobileImages || []);
                                
                                if (!images || images.length === 0) {
                                    return (
                                        <div className="m-auto flex flex-col items-center justify-center text-gray-400">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                {previewDevice === "DESKTOP" ? <FiMonitor className="text-4xl" /> : previewDevice === "TABLET" ? <FiTablet className="text-4xl" /> : <FiSmartphone className="text-4xl" />}
                                            </div>
                                            <p className="italic font-medium">Chưa có ảnh xem trước cho thiết bị này.</p>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div className={cn(
                                        "w-full flex flex-col gap-10",
                                        previewDevice === "DESKTOP" ? "max-w-5xl" : previewDevice === "TABLET" ? "max-w-2xl" : "max-w-sm"
                                    )}>
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/60 bg-white">
                                                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-auto object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Apply Restaurant Modal */}
            {restaurantModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative max-h-[90vh]">
                        <button 
                            onClick={() => setRestaurantModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <FiX className="text-xl" />
                        </button>
                        
                        <h3 className="text-xl font-bold text-gray-900 pr-8">Tùy chọn áp dụng</h3>
                        <p className="text-sm text-gray-500">Bạn muốn áp dụng mẫu giao diện này cho nhà hàng nào?</p>
                        
                        <div className="flex flex-col gap-3 mt-2 overflow-y-auto pr-2">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input 
                                    type="radio" 
                                    name="restaurantTarget" 
                                    checked={isApplyAllRestaurants}
                                    onChange={() => setIsApplyAllRestaurants(true)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="font-medium text-gray-800">Tất cả nhà hàng</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input 
                                    type="radio" 
                                    name="restaurantTarget" 
                                    checked={!isApplyAllRestaurants}
                                    onChange={() => setIsApplyAllRestaurants(false)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="font-medium text-gray-800">Chọn nhà hàng cụ thể</span>
                            </label>
                            
                            {!isApplyAllRestaurants && (
                                <div className="flex flex-col gap-2 pl-8 mt-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Danh sách chi nhánh</span>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                if (selectedRestaurantIds.length === restaurants.length) {
                                                    setSelectedRestaurantIds([]);
                                                } else {
                                                    setSelectedRestaurantIds(restaurants.map(r => r.id));
                                                }
                                            }}
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            {selectedRestaurantIds.length === restaurants.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-1">
                                        {restaurants.map(res => (
                                            <label key={res.id} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedRestaurantIds.includes(res.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedRestaurantIds([...selectedRestaurantIds, res.id]);
                                                        } else {
                                                            setSelectedRestaurantIds(selectedRestaurantIds.filter(id => id !== res.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700 line-clamp-1">{res.name}</span>
                                            </label>
                                        ))}
                                        {restaurants.length === 0 && (
                                            <div className="text-sm text-gray-500 italic py-2 text-center">Chưa có chi nhánh nào</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-gray-100">
                            <button 
                                onClick={() => setRestaurantModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleConfirmApplyRestaurant}
                                disabled={isUpdatingRestaurant || (!isApplyAllRestaurants && selectedRestaurantIds.length === 0)}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUpdatingRestaurant ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang xử lý...</>
                                ) : "Xác nhận áp dụng"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FadeIn>
    );
};

export default TemplateSelection;
