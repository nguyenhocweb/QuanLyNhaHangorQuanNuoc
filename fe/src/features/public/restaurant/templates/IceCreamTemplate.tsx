"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useScrollSpy } from "@/src/core/hooks/useScrollSpy";
import { useScrollTo } from "@/src/core/hooks/useScrollTo";
import IceCreamHero from "@/src/features/public/restaurant/components/icecream/IceCreamHero";
import NavigationTabs from "@/src/features/public/restaurant/components/NavigationTabs";
import IceCreamIntro from "@/src/features/public/restaurant/components/icecream/IceCreamIntro";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";
import IceCreamGallery from "@/src/features/public/restaurant/components/icecream/IceCreamGallery";
import AmenitiesTab from "@/src/features/public/restaurant/components/AmenitiesTab";
import PoliciesTab from "@/src/features/public/restaurant/components/PoliciesTab";
import IceCreamMenu from "@/src/features/public/restaurant/components/icecream/IceCreamMenu";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import CategoriesTab from "@/src/features/public/restaurant/components/CategoriesTab";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface IceCreamTemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function IceCreamTemplate({ idRestaurant, coreInfo, hoursData }: IceCreamTemplateProps) {
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
        <div className="min-h-screen bg-[#FFF8F0] pb-24 font-sans text-[#5D4037]">
            {/* CSS Override cho các component dùng chung (màu pastel pink/blue/vani) */}
            <style jsx global>{`
                /* Ice Cream Style Overrides */
                .icecream-wrapper .bg-white { background-color: #FFFFFF !important; }
                .icecream-wrapper .text-gray-900, .icecream-wrapper .text-gray-800 { color: #5D4037 !important; }
                .icecream-wrapper .text-gray-600, .icecream-wrapper .text-gray-500 { color: #8D6E63 !important; }
                
                /* Pastel Pink Primary */
                .icecream-wrapper .text-indigo-600, .icecream-wrapper .text-indigo-700 { color: #FF8BA7 !important; } 
                .icecream-wrapper .bg-indigo-600 { background-color: #FF8BA7 !important; }
                .icecream-wrapper .hover\\:bg-indigo-700:hover { background-color: #FF7496 !important; } 
                .icecream-wrapper .bg-indigo-50 { background-color: #FFF0F3 !important; border-color: #FFE3E9 !important; }
                .icecream-wrapper .border-indigo-100, .icecream-wrapper .border-indigo-200 { border-color: #FFC4D1 !important; }
                .icecream-wrapper .ring-indigo-500 { --tw-ring-color: #FF8BA7 !important; }
                .icecream-wrapper .focus\\:ring-indigo-500:focus { --tw-ring-color: #FF8BA7 !important; border-color: #FF8BA7 !important; }
                
                /* Soft Sweet Shadows & Rounded Corners */
                .icecream-wrapper .shadow-sm, .icecream-wrapper .shadow-md, .icecream-wrapper .shadow-lg { box-shadow: 0 10px 40px -10px rgba(255, 139, 167, 0.15) !important; }
                .icecream-wrapper .rounded-xl { border-radius: 20px !important; }
                .icecream-wrapper .rounded-2xl { border-radius: 32px !important; }
                .icecream-wrapper .border-gray-100 { border-color: #FFE3E9 !important; }
                .icecream-wrapper .ring-gray-200 { --tw-ring-color: #FFE3E9 !important; }
                
                /* Custom scrollbar for ice cream theme */
                ::-webkit-scrollbar-thumb {
                    background: #FFC4D1;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #FF8BA7;
                }
            `}</style>

            <div className="icecream-wrapper">
                {/* 1. Hero Section */}
                <IceCreamHero coreInfo={coreInfo} />

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
                                    <IceCreamIntro coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.08}>
                                <section id="GALLERY" className="scroll-mt-36">
                                    <IceCreamGallery coreInfo={coreInfo} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <section id="CATEGORIES" className="scroll-mt-36">
                                    <CategoriesTab categories={coreInfo.categories} />
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.15}>
                                <section id="PROMOTIONS" className="scroll-mt-36">
                                    <div className="py-24 text-center bg-white rounded-[32px] shadow-sm border border-[#FFE3E9]">
                                        <h3 className="text-2xl font-semibold text-[#5D4037] font-sans">Chưa có ưu đãi ngọt ngào nào</h3>
                                        <p className="text-[#8D6E63] mt-3 font-sans">Vui lòng quay lại sau để cập nhật các ưu đãi mới nhất từ quán.</p>
                                    </div>
                                </section>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <section id="MENU" className="scroll-mt-36">
                                    <IceCreamMenu restaurantId={idRestaurant} />
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
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#FFE3E9] shadow-[0_-4px_20px_rgba(255,139,167,0.1)] md:hidden z-50">
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
                        className="w-full bg-[#FF8BA7] hover:bg-[#FF7496] text-white font-sans font-bold py-4 px-6 rounded-full shadow-lg transition-transform active:scale-95"
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
