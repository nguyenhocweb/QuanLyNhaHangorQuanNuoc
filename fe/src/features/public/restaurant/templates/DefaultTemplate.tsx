"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import HeroSection from "@/src/features/public/restaurant/components/HeroSection";
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import IntroTab from "@/src/features/public/restaurant/components/IntroTab";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";
import GalleryTab from "@/src/features/public/restaurant/components/GalleryTab";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import MenuTab from "@/src/features/public/restaurant/components/MenuTab";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface DefaultTemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function DefaultTemplate({ idRestaurant, coreInfo, hoursData }: DefaultTemplateProps) {
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

    // Scroll Spy Setup (MUST BE BEFORE EARLY RETURNS)
    const sectionIds = ["INTRO", "GALLERY", "CATEGORIES", "PROMOTIONS", "MENU", "AMENITIES", "HOURS", "LOCATION", "POLICIES", "REVIEWS"];
    const activeTabId = useScrollSpy(sectionIds) || "INTRO";
    const scrollToSection = useScrollTo(140); // Offset for fixed header + navigation tabs

    const handleTabChange = (tabId: "INTRO" | "GALLERY" | "CATEGORIES" | "PROMOTIONS" | "MENU" | "AMENITIES" | "HOURS" | "LOCATION" | "POLICIES" | "REVIEWS") => {
        scrollToSection(tabId);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* 1. Hero Section */}
            <HeroSection 
                coreInfo={coreInfo} 
                hoursData={hoursData} 
            />

            {/* 2. Sticky Navigation */}
            <NavigationTabs 
                activeTab={activeTabId} 
                onChangeTab={handleTabChange} 
                reviewCount={coreInfo.totalRating} 
            />

            {/* 3. Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left: Main Content (70%) */}
                    <div className="flex-1 w-full space-y-16 min-w-0">
                        <FadeIn delay={0.05}>
                            <section id="INTRO" className="scroll-mt-36">
                                <IntroTab coreInfo={coreInfo} />
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.08}>
                            <section id="GALLERY" className="scroll-mt-36">
                                <GalleryTab coreInfo={coreInfo} />
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <section id="CATEGORIES" className="scroll-mt-36">
                                <CategoriesTab categories={coreInfo.categories} />
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.15}>
                            <section id="PROMOTIONS" className="scroll-mt-36">
                                <div className="py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-700">Chưa có chương trình khuyến mãi nào</h3>
                                    <p className="text-gray-500 mt-2">Vui lòng quay lại sau để cập nhật các ưu đãi mới nhất.</p>
                                </div>
                            </section>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <section id="MENU" className="scroll-mt-36">
                                <MenuTab restaurantId={idRestaurant} />
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
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-50">
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
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-95"
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
    );
}
