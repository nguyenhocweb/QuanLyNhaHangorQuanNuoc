"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

// Custom Sushi Components
import SushiHero from "@/src/features/public/restaurant/components/sushi/SushiHero";
import SushiIntro from "@/src/features/public/restaurant/components/sushi/SushiIntro";
import SushiGallery from "@/src/features/public/restaurant/components/sushi/SushiGallery";
import SushiMenu from "@/src/features/public/restaurant/components/sushi/SushiMenu";

interface SushiTemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function SushiTemplate({ idRestaurant, coreInfo, hoursData }: SushiTemplateProps) {
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
        <div className="min-h-screen bg-[#0F0F0F] pb-24 font-sans text-[#EAEAEA]">
            {/* CSS Override cho các component dùng chung (màu tối, đỏ, vàng kim) */}
            <style jsx global>{`
                /* Sushi Style Overrides - Dark Mode */
                .sushi-wrapper .bg-white { background-color: #1A1A1A !important; }
                .sushi-wrapper .text-gray-900, .sushi-wrapper .text-gray-800 { color: #F5F5F5 !important; }
                .sushi-wrapper .text-gray-600, .sushi-wrapper .text-gray-500 { color: #A0A0A0 !important; }
                .sushi-wrapper .text-indigo-600, .sushi-wrapper .text-indigo-700 { color: #D32F2F !important; } /* Crimson Red */
                .sushi-wrapper .bg-indigo-600 { background-color: #D32F2F !important; }
                .sushi-wrapper .hover\\:bg-indigo-700:hover { background-color: #B71C1C !important; }
                .sushi-wrapper .bg-indigo-50 { background-color: rgba(211, 47, 47, 0.1) !important; border-color: rgba(211, 47, 47, 0.2) !important; }
                .sushi-wrapper .border-indigo-100, .sushi-wrapper .border-indigo-200 { border-color: rgba(211, 47, 47, 0.3) !important; }
                .sushi-wrapper .ring-indigo-500 { --tw-ring-color: #D32F2F !important; }
                .sushi-wrapper .focus\\:ring-indigo-500:focus { --tw-ring-color: #D32F2F !important; border-color: #D32F2F !important; }
                .sushi-wrapper .shadow-sm, .sushi-wrapper .shadow-md, .sushi-wrapper .shadow-lg { box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5) !important; }
                .sushi-wrapper .rounded-xl, .sushi-wrapper .rounded-2xl { border-radius: 12px !important; }
                .sushi-wrapper .border-gray-100, .sushi-wrapper .border-gray-200 { border-color: #333333 !important; }
                .sushi-wrapper input, .sushi-wrapper select, .sushi-wrapper textarea { background-color: #242424 !important; color: white !important; border-color: #404040 !important; }
            `}</style>

            <div className="sushi-wrapper">
                {/* 1. Hero Section */}
                <SushiHero coreInfo={coreInfo} hoursData={hoursData} />

                {/* 2. Sticky Navigation */}
                <div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-md border-b border-[#333]">
                    <NavigationTabs 
                        activeTab={activeTabId} 
                        onChangeTab={handleTabChange} 
                        reviewCount={coreInfo.totalRating} 
                        variant="sushi"
                    />
                </div>

                {/* 3. Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Left: Main Content (70%) */}
                        <div className="flex-1 w-full space-y-20 min-w-0">
                            <FadeIn delay={0.05}>
                                <section id="INTRO" className="scroll-mt-36">
                                    <SushiIntro coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.08}>
                                <section id="GALLERY" className="scroll-mt-36">
                                    <SushiGallery coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <section id="CATEGORIES" className="scroll-mt-36">
                                    <CategoriesTab categories={coreInfo.categories} variant="sushi" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.15}>
                                <section id="PROMOTIONS" className="scroll-mt-36">
                                    <div className="py-24 text-center bg-[#1A1A1A] rounded-2xl shadow-sm border border-[#333]">
                                        <h3 className="text-2xl font-semibold text-[#D4AF37] font-serif">Chưa có ưu đãi nào</h3>
                                        <p className="text-[#A0A0A0] mt-3 font-sans">Vui lòng quay lại sau để cập nhật các ưu đãi mới nhất.</p>
                                    </div>
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <section id="MENU" className="scroll-mt-36">
                                    <SushiMenu restaurantId={idRestaurant} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.25}>
                                <section id="AMENITIES" className="scroll-mt-36">
                                    <AmenitiesTab coreInfo={coreInfo} variant="sushi" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.35}>
                                <section id="HOURS" className="scroll-mt-36">
                                    <OperatingHoursTab hoursData={hoursData} variant="sushi" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.38}>
                                <section id="LOCATION" className="scroll-mt-36">
                                    <LocationTab coreInfo={coreInfo} variant="sushi" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <section id="POLICIES" className="scroll-mt-36">
                                    <PoliciesTab coreInfo={coreInfo} variant="sushi" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.45}>
                                <section id="REVIEWS" className="scroll-mt-36">
                                    <ReviewsTab restaurantId={idRestaurant} coreInfo={coreInfo} variant="sushi" />
                                </section>
                            </FadeIn>
                        </div>

                        {/* Right: Sticky Booking Form (30%) */}
                        <div className="hidden lg:block w-[380px] flex-shrink-0 sticky top-36">
                            <div className="bg-[#1A1A1A] border-t-4 border-[#D32F2F] rounded-2xl shadow-2xl p-1">
                                <BookingWidget onContinue={handleContinueBooking} variant="sushi" />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Mobile Booking FAB */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121212] border-t border-[#333] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:hidden z-50">
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
                        className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-bold py-4 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(211,47,47,0.39)] transition-all active:scale-95"
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
                        variant="sushi"
                    />
                )}

                <BookingConfirmationModal 
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    idRestaurant={idRestaurant}
                    draftData={bookingDraft}
                    variant="sushi"
                />
            </div>
        </div>
    );
}
