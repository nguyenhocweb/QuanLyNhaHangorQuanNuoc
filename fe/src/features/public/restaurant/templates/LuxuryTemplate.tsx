"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";

// Custom Luxury Components
import LuxuryHero from "@/src/features/public/restaurant/components/luxury/LuxuryHero";
import LuxuryIntro from "@/src/features/public/restaurant/components/luxury/LuxuryIntro";
import LuxuryGallery from "@/src/features/public/restaurant/components/luxury/LuxuryGallery";
import LuxuryMenu from "@/src/features/public/restaurant/components/luxury/LuxuryMenu";

// Standard Components (Will be wrapped)
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";

import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface TemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function LuxuryTemplate({ idRestaurant, coreInfo, hoursData }: TemplateProps) {
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

    const sectionIds = ["INTRO", "GALLERY", "CATEGORIES", "MENU", "AMENITIES", "HOURS", "LOCATION", "POLICIES", "REVIEWS"];
    const activeTabId = useScrollSpy(sectionIds) || "INTRO";
    const scrollToSection = useScrollTo(140);

    const handleTabChange = (tabId: any) => {
        scrollToSection(tabId);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-24 font-sans text-zinc-300 selection:bg-yellow-600 selection:text-black">
            
            <LuxuryHero coreInfo={coreInfo} hoursData={hoursData} />

            {/* Navigation - Minimal Text Style */}
            <div className="border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 opacity-80 hover:opacity-100 transition-opacity">
                    <NavigationTabs activeTab={activeTabId} onChangeTab={handleTabChange} reviewCount={coreInfo.totalRating} variant="luxury" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col xl:flex-row gap-16 items-start">
                    
                    {/* Left: Main Content */}
                    <div className="flex-1 w-full min-w-0">
                        
                        <FadeIn delay={0.1}>
                            <section id="INTRO" className="scroll-mt-36">
                                <LuxuryIntro coreInfo={coreInfo} />
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <section id="GALLERY" className="scroll-mt-36 border-b border-[#222] pb-16">
                                <LuxuryGallery coreInfo={coreInfo} />
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <section id="MENU" className="scroll-mt-36 border-b border-[#222] pb-16">
                                <LuxuryMenu restaurantId={idRestaurant} />
                            </section>
                        </FadeIn>

                        {/* Wrapper for standard components to force dark mode safely without affecting modals */}
                        <div className="space-y-24 mt-24 [&_.bg-white]:!bg-[#111] [&_.bg-white]:!border-[#222] [&_.text-gray-900]:!text-yellow-500 [&_.text-gray-800]:!text-yellow-600 [&_.text-gray-700]:!text-zinc-200 [&_.text-gray-600]:!text-zinc-400 [&_.text-gray-500]:!text-zinc-500 [&_.border-gray-100]:!border-[#222] [&_.border-gray-200]:!border-[#222] [&_.shadow-sm]:!shadow-black/50 [&_.bg-gray-50]:!bg-[#1a1a1a] [&_.bg-indigo-100]:!bg-[#222] [&_.text-indigo-600]:!text-yellow-600">
                            
                            <FadeIn delay={0.4}>
                                <section id="CATEGORIES" className="scroll-mt-36">
                                    <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Danh mục</h2>
                                    <CategoriesTab categories={coreInfo.categories} variant="luxury" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.5}>
                                <section id="AMENITIES" className="scroll-mt-36">
                                    <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Tiện ích</h2>
                                    <AmenitiesTab coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.6}>
                                <section id="HOURS" className="scroll-mt-36">
                                    <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Giờ hoạt động</h2>
                                    <OperatingHoursTab hoursData={hoursData} variant="luxury" />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.7}>
                                <section id="LOCATION" className="scroll-mt-36">
                                    <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Vị trí</h2>
                                    <LocationTab coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.8}>
                                <section id="POLICIES" className="scroll-mt-36">
                                    <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Chính sách</h2>
                                    <PoliciesTab coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.9}>
                                <section id="REVIEWS" className="scroll-mt-36">
                                    <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Đánh giá</h2>
                                    <ReviewsTab restaurantId={idRestaurant} coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                        </div>
                    </div>

                    {/* Right: Booking Widget Sticky */}
                    <div className="w-full xl:w-[420px] shrink-0 sticky top-[120px] z-30">
                        <FadeIn delay={0.2}>
                            <BookingWidget 
                                onContinue={handleContinueBooking} 
                                variant="luxury"
                            />
                        </FadeIn>
                    </div>

                </div>
            </main>

            {/* Modals are kept outside the CSS overrides to prevent breaking */}
            {isTableModalOpen && (
                <TableSelectionModal
                    isOpen={isTableModalOpen}
                    onClose={() => setIsTableModalOpen(false)}
                    idRestaurant={idRestaurant}
                    draftData={bookingDraft}
                    onConfirmTable={handleConfirmTable}
                    variant="luxury"
                />
            )}

            {isConfirmModalOpen && (
                <BookingConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    draftData={bookingDraft}
                    variant="luxury"
                />
            )}
        </div>
    );
}
