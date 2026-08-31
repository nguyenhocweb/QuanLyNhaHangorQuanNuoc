"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import HotpotHero from "@/src/features/public/restaurant/components/hotpot/HotpotHero";
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import HotpotIntro from "@/src/features/public/restaurant/components/hotpot/HotpotIntro";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";
import HotpotGallery from "@/src/features/public/restaurant/components/hotpot/HotpotGallery";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import HotpotMenu from "@/src/features/public/restaurant/components/hotpot/HotpotMenu";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface HotpotTemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function HotpotTemplate({ idRestaurant, coreInfo, hoursData }: HotpotTemplateProps) {
    const [bookingDraft, setBookingDraft] = useState<any>(null);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleContinueBooking = (draft: any) => {
        setBookingDraft(draft);
        if (draft.bookingType === 'MANUAL') {
            setIsTableModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmTable = (tableId: string, tableNumber: string) => {
        setBookingDraft((prev: any) => ({
            ...prev,
            selectedTable: { id: tableId, name: tableNumber }
        }));
        setIsTableModalOpen(false);
        setIsConfirmModalOpen(true);
    };

    const sectionIds = ["INTRO", "GALLERY", "CATEGORIES", "PROMOTIONS", "MENU", "AMENITIES", "HOURS", "LOCATION", "POLICIES", "REVIEWS"];
    const activeTabId = useScrollSpy(sectionIds) || "INTRO";
    const scrollToSection = useScrollTo(140);

    const handleTabChange = (tabId: "INTRO" | "GALLERY" | "CATEGORIES" | "PROMOTIONS" | "MENU" | "AMENITIES" | "HOURS" | "LOCATION" | "POLICIES" | "REVIEWS") => {
        scrollToSection(tabId);
    };

    return (
        <div className="min-h-screen bg-[#141414] pb-24 font-sans text-[#E0E0E0]">
            {/* CSS Override cho Hotpot Theme (Đỏ/Đen) */}
            <style jsx global>{`
                /* Hotpot Style Overrides */
                .hotpot-wrapper .bg-white { background-color: #1A1A1A !important; }
                .hotpot-wrapper .bg-white\\/80 { background-color: rgba(26, 26, 26, 0.95) !important; }
                .hotpot-wrapper .text-gray-900, .hotpot-wrapper .text-gray-800 { color: #F5F5F5 !important; }
                .hotpot-wrapper .text-gray-600, .hotpot-wrapper .text-gray-500 { color: #AAAAAA !important; }
                .hotpot-wrapper .text-indigo-600, .hotpot-wrapper .text-indigo-700 { color: #D32F2F !important; } /* Red */
                .hotpot-wrapper .bg-indigo-600 { background-color: #D32F2F !important; }
                .hotpot-wrapper .hover\\:bg-indigo-700:hover { background-color: #B71C1C !important; } /* Dark Red */
                .hotpot-wrapper .bg-indigo-50 { background-color: #2D1414 !important; border-color: #4A1C1C !important; }
                .hotpot-wrapper .border-indigo-100, .hotpot-wrapper .border-indigo-200 { border-color: #4A1C1C !important; }
                .hotpot-wrapper .border-indigo-600 { border-color: #D32F2F !important; }
                .hotpot-wrapper .hover\\:border-gray-300:hover { border-color: #555555 !important; }
                .hotpot-wrapper .ring-indigo-500 { --tw-ring-color: #D32F2F !important; }
                .hotpot-wrapper .focus\\:ring-indigo-500:focus { --tw-ring-color: #D32F2F !important; border-color: #D32F2F !important; }
                .hotpot-wrapper .shadow-sm, .hotpot-wrapper .shadow-md, .hotpot-wrapper .shadow-lg { box-shadow: 0 8px 30px rgba(211, 47, 47, 0.1) !important; }
                .hotpot-wrapper .rounded-xl, .hotpot-wrapper .rounded-2xl { border-radius: 8px !important; }
                .hotpot-wrapper .border-gray-100, .hotpot-wrapper .border-gray-200 { border-color: #333333 !important; }
                .hotpot-wrapper .ring-gray-200 { --tw-ring-color: #333333 !important; }
                
                /* Lớp nền Modal vẫn cần giữ tối/sáng hợp lý, tạm thời override các chữ text-gray-... */
            `}</style>

            <div className="hotpot-wrapper">
                {/* 1. Hero Section */}
                <HotpotHero coreInfo={coreInfo} />

                {/* 2. Sticky Navigation */}
                <NavigationTabs 
                    activeTab={activeTabId} 
                    onChangeTab={handleTabChange} 
                    reviewCount={coreInfo.totalRating} 
                    variant="hotpot"
                />

                {/* 3. Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Left: Main Content (70%) */}
                        <div className="flex-1 w-full space-y-20 min-w-0">
                            <FadeIn delay={0.05}>
                                <section id="INTRO" className="scroll-mt-36">
                                    <HotpotIntro coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.08}>
                                <section id="GALLERY" className="scroll-mt-36">
                                    <HotpotGallery coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <section id="CATEGORIES" className="scroll-mt-36">
                                    <CategoriesTab categories={coreInfo.categories} variant="hotpot" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.15}>
                                <section id="PROMOTIONS" className="scroll-mt-36">
                                    <div className="py-24 text-center bg-[#1A1A1A] rounded-xl shadow-sm border border-[#333333]">
                                        <h3 className="text-2xl font-semibold text-[#F5F5F5] font-sans">Chưa có ưu đãi nào</h3>
                                        <p className="text-[#AAAAAA] mt-3 font-sans">Vui lòng quay lại sau để cập nhật các ưu đãi mới nhất từ quán.</p>
                                    </div>
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <section id="MENU" className="scroll-mt-36">
                                    <HotpotMenu restaurantId={idRestaurant} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.25}>
                                <section id="AMENITIES" className="scroll-mt-36">
                                    <AmenitiesTab coreInfo={coreInfo} variant="hotpot" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.35}>
                                <section id="HOURS" className="scroll-mt-36">
                                    <OperatingHoursTab hoursData={hoursData} variant="hotpot" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.38}>
                                <section id="LOCATION" className="scroll-mt-36">
                                    <LocationTab coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <section id="POLICIES" className="scroll-mt-36">
                                    <PoliciesTab coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.45}>
                                <section id="REVIEWS" className="scroll-mt-36">
                                    <ReviewsTab restaurantId={idRestaurant} coreInfo={coreInfo} />
                                </section>
                            </FadeIn>
                        </div>

                        {/* Right: Sticky Booking Form (30%) */}
                        <div className="hidden lg:block w-[380px] flex-shrink-0 sticky top-36">
                            <BookingWidget onContinue={handleContinueBooking} variant="hotpot" />
                        </div>
                    </div>
                </main>

                {/* Mobile Booking FAB */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1A1A1A] border-t border-[#333333] shadow-[0_-4px_20px_rgba(211,47,47,0.1)] md:hidden z-50">
                    <button 
                        onClick={() => {
                            const dummyDraft = {
                                date: new Date().toISOString().split('T')[0],
                                time: "19:00",
                                endTime: "21:00",
                                partySize: 2,
                                bookingType: 'AUTO'
                            };
                            handleContinueBooking(dummyDraft);
                        }}
                        className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-bold py-4 px-6 rounded-lg shadow-lg transition-all active:scale-95"
                    >
                        Đặt bàn ngay
                    </button>
                </div>

                {/* Modals */}
                {isTableModalOpen && (
                    <TableSelectionModal
                        isOpen={isTableModalOpen}
                        onClose={() => setIsTableModalOpen(false)}
                        idRestaurant={idRestaurant}
                        draftData={bookingDraft}
                        onConfirmTable={handleConfirmTable}
                        variant="hotpot"
                    />
                )}

                <BookingConfirmationModal 
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    idRestaurant={idRestaurant}
                    draftData={bookingDraft}
                    variant="hotpot"
                />
            </div>
        </div>
    );
}
