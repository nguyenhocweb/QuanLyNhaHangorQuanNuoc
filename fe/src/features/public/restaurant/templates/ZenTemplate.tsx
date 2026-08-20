"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import ZenHero from "@/src/features/public/restaurant/components/zen/ZenHero";
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import ZenIntro from "@/src/features/public/restaurant/components/zen/ZenIntro";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";
import ZenGallery from "@/src/features/public/restaurant/components/zen/ZenGallery";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import ZenMenu from "@/src/features/public/restaurant/components/zen/ZenMenu";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface ZenTemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function ZenTemplate({ idRestaurant, coreInfo, hoursData }: ZenTemplateProps) {
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
        <div className="min-h-screen bg-[#faf9f6] pb-24 font-sans text-[#4a4036]">
            {/* CSS Override cho các component dùng chung (màu cát/rêu) */}
            <style jsx global>{`
                /* Zen Style Overrides */
                .zen-wrapper .bg-white { background-color: #fffaf0 !important; }
                .zen-wrapper .text-gray-900, .zen-wrapper .text-gray-800 { color: #2c3e2e !important; }
                .zen-wrapper .text-gray-600, .zen-wrapper .text-gray-500 { color: #5c6655 !important; }
                .zen-wrapper .text-indigo-600, .zen-wrapper .text-indigo-700 { color: #4d7c0f !important; } /* Matcha Green */
                .zen-wrapper .bg-indigo-600 { background-color: #4d7c0f !important; }
                .zen-wrapper .hover\\:bg-indigo-700:hover { background-color: #3f6212 !important; }
                .zen-wrapper .bg-indigo-50 { background-color: #f4f5f0 !important; border-color: #e5e7df !important; }
                .zen-wrapper .border-indigo-100, .zen-wrapper .border-indigo-200 { border-color: #d2d6c9 !important; }
                .zen-wrapper .ring-indigo-500 { --tw-ring-color: #4d7c0f !important; }
                .zen-wrapper .focus\\:ring-indigo-500:focus { --tw-ring-color: #4d7c0f !important; border-color: #4d7c0f !important; }
                .zen-wrapper .shadow-sm, .zen-wrapper .shadow-md, .zen-wrapper .shadow-lg { box-shadow: 0 10px 40px -10px rgba(77, 124, 15, 0.08) !important; }
                .zen-wrapper .rounded-xl, .zen-wrapper .rounded-2xl { border-radius: 24px !important; }
                .zen-wrapper .border-gray-100 { border-color: #efece5 !important; }
            `}</style>

            <div className="zen-wrapper">
                {/* 1. Hero Section */}
                <ZenHero coreInfo={coreInfo} />

                {/* 2. Sticky Navigation */}
                <NavigationTabs 
                    activeTab={activeTabId} 
                    onChangeTab={handleTabChange} 
                    reviewCount={coreInfo.totalRating} 
                />

                {/* 3. Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Left: Main Content (70%) */}
                        <div className="flex-1 w-full space-y-20 min-w-0">
                            <FadeIn delay={0.05}>
                                <section id="INTRO" className="scroll-mt-36">
                                    <ZenIntro coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.08}>
                                <section id="GALLERY" className="scroll-mt-36">
                                    <ZenGallery coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <section id="CATEGORIES" className="scroll-mt-36">
                                    <CategoriesTab categories={coreInfo.categories} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.15}>
                                <section id="PROMOTIONS" className="scroll-mt-36">
                                    <div className="py-24 text-center bg-[#fffaf0] rounded-[32px] shadow-sm border border-[#efece5]">
                                        <h3 className="text-2xl font-semibold text-[#2c3e2e] font-sans">Chưa có ưu đãi nào</h3>
                                        <p className="text-[#5c6655] mt-3 font-sans">Vui lòng quay lại sau để cập nhật các ưu đãi mới nhất.</p>
                                    </div>
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <section id="MENU" className="scroll-mt-36">
                                    <ZenMenu restaurantId={idRestaurant} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.25}>
                                <section id="AMENITIES" className="scroll-mt-36">
                                    <AmenitiesTab coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.35}>
                                <section id="HOURS" className="scroll-mt-36">
                                    <OperatingHoursTab hoursData={hoursData} />
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
                            <BookingWidget onContinue={handleContinueBooking} />
                        </div>
                    </div>
                </main>

                {/* Mobile Booking FAB */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#fffaf0] border-t border-[#efece5] shadow-[0_-4px_20px_rgba(77,124,15,0.05)] md:hidden z-50">
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
                        className="w-full bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-sans font-bold py-4 px-6 rounded-full shadow-lg transition-all active:scale-95"
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
                    />
                )}

                <BookingConfirmationModal 
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    draftData={bookingDraft}
                />
            </div>
        </div>
    );
}
