"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import CafeHero from "@/src/features/public/restaurant/components/cafe/CafeHero";
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import CafeIntro from "@/src/features/public/restaurant/components/cafe/CafeIntro";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";
import CafeGallery from "@/src/features/public/restaurant/components/cafe/CafeGallery";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import CafeMenu from "@/src/features/public/restaurant/components/cafe/CafeMenu";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface CafeTemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function CafeTemplate({ idRestaurant, coreInfo, hoursData }: CafeTemplateProps) {
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
        <div className="min-h-screen bg-[#FDFBF7] pb-24 font-sans text-[#4A3F35]">
            {/* CSS Override cho các component dùng chung (màu cà phê/kem) */}
            <style jsx global>{`
                /* Cafe Style Overrides */
                .cafe-wrapper .bg-white { background-color: #FFFFFF !important; }
                .cafe-wrapper .text-gray-900, .cafe-wrapper .text-gray-800 { color: #3B3131 !important; }
                .cafe-wrapper .text-gray-600, .cafe-wrapper .text-gray-500 { color: #6E5C53 !important; }
                .cafe-wrapper .text-indigo-600, .cafe-wrapper .text-indigo-700 { color: #8B5A2B !important; } /* Coffee Brown */
                .cafe-wrapper .bg-indigo-600 { background-color: #8B5A2B !important; }
                .cafe-wrapper .hover\\:bg-indigo-700:hover { background-color: #5C4033 !important; } /* Dark Coffee */
                .cafe-wrapper .bg-indigo-50 { background-color: #FAF5F0 !important; border-color: #EFE6DD !important; }
                .cafe-wrapper .border-indigo-100, .cafe-wrapper .border-indigo-200 { border-color: #DCCCBD !important; }
                .cafe-wrapper .ring-indigo-500 { --tw-ring-color: #8B5A2B !important; }
                .cafe-wrapper .focus\\:ring-indigo-500:focus { --tw-ring-color: #8B5A2B !important; border-color: #8B5A2B !important; }
                .cafe-wrapper .shadow-sm, .cafe-wrapper .shadow-md, .cafe-wrapper .shadow-lg { box-shadow: 0 10px 40px -10px rgba(139, 90, 43, 0.08) !important; }
                .cafe-wrapper .rounded-xl, .cafe-wrapper .rounded-2xl { border-radius: 16px !important; }
                .cafe-wrapper .border-gray-100 { border-color: #F0EAE1 !important; }
                .cafe-wrapper .ring-gray-200 { --tw-ring-color: #F0EAE1 !important; }
            `}</style>

            <div className="cafe-wrapper">
                {/* 1. Hero Section */}
                <CafeHero coreInfo={coreInfo} />

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
                                    <CafeIntro coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.08}>
                                <section id="GALLERY" className="scroll-mt-36">
                                    <CafeGallery coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <section id="CATEGORIES" className="scroll-mt-36">
                                    <CategoriesTab categories={coreInfo.categories} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.15}>
                                <section id="PROMOTIONS" className="scroll-mt-36">
                                    <div className="py-24 text-center bg-white rounded-2xl shadow-sm border border-[#F0EAE1]">
                                        <h3 className="text-2xl font-semibold text-[#3B3131] font-sans">Chưa có ưu đãi nào</h3>
                                        <p className="text-[#6E5C53] mt-3 font-sans">Vui lòng quay lại sau để cập nhật các ưu đãi mới nhất từ quán.</p>
                                    </div>
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <section id="MENU" className="scroll-mt-36">
                                    <CafeMenu restaurantId={idRestaurant} />
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
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F0EAE1] shadow-[0_-4px_20px_rgba(139,90,43,0.05)] md:hidden z-50">
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
                        className="w-full bg-[#8B5A2B] hover:bg-[#5C4033] text-white font-sans font-bold py-4 px-6 rounded-full shadow-lg transition-all active:scale-95"
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
