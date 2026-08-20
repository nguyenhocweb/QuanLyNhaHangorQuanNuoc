"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

import Immersive3DBackground from "@/src/features/public/restaurant/components/immersive/Immersive3DBackground";
import ImmersiveHero from "@/src/features/public/restaurant/components/immersive/ImmersiveHero";
import ImmersiveInfo from "@/src/features/public/restaurant/components/immersive/ImmersiveInfo";
import ImmersiveGallery from "@/src/features/public/restaurant/components/immersive/ImmersiveGallery";
import ImmersiveCard from "@/src/features/public/restaurant/components/immersive/ImmersiveCard";

import MenuTab from "@/src/features/public/restaurant/components/MenuTab";
import ReviewsTab from "@/src/features/public/restaurant/components/ReviewsTab";
import BookingWidget from "@/src/features/public/restaurant/components/BookingWidget";
import BookingConfirmationModal from "@/src/features/public/restaurant/components/BookingConfirmationModal";
import TableSelectionModal from "@/src/features/public/restaurant/components/TableSelectionModal";
import OperatingHoursTab from "@/src/features/public/restaurant/components/OperatingHoursTab";
import LocationTab from "@/src/features/public/restaurant/components/LocationTab";

import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface TemplateProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

export default function ImmersiveTemplate({ idRestaurant, coreInfo, hoursData }: TemplateProps) {
    const { is3D } = usePerformanceMode();
    const [bookingDraft, setBookingDraft] = useState<any>(null);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleBookingSubmit = (data: any) => {
        setBookingDraft(data);
        if (data.bookingType === 'MANUAL') {
            setIsTableModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    };

    const handleTableSelected = (tableId: string) => {
        setBookingDraft({ ...bookingDraft, tableId });
        setIsTableModalOpen(false);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmBooking = () => {
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <Immersive3DBackground>
                <div className="min-h-screen pb-24">
                    <FadeIn>
                        <ImmersiveHero coreInfo={coreInfo} />
                    </FadeIn>

                    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 relative z-10 -mt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                            
                            {/* Left Column (Main Content) */}
                            <div className="lg:col-span-7 flex flex-col gap-8">
                                <FadeIn delay={0.1}>
                                    <ImmersiveInfo coreInfo={coreInfo} />
                                </FadeIn>

                                <FadeIn delay={0.2}>
                                    <ImmersiveGallery coreInfo={coreInfo} />
                                </FadeIn>

                                <FadeIn delay={0.3}>
                                    <ImmersiveCard>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thực Đơn</h2>
                                        <MenuTab restaurantId={idRestaurant} />
                                    </ImmersiveCard>
                                </FadeIn>

                                <FadeIn delay={0.4}>
                                    <ImmersiveCard>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh Giá</h2>
                                        <ReviewsTab restaurantId={idRestaurant} coreInfo={coreInfo} />
                                    </ImmersiveCard>
                                </FadeIn>
                            </div>

                            {/* Right Column (Sticky Sidebar) */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-28 flex flex-col gap-8">
                                    <FadeIn delay={0.2}>
                                        <ImmersiveCard className="!mt-0">
                                            <BookingWidget onContinue={handleBookingSubmit} />
                                        </ImmersiveCard>
                                    </FadeIn>

                                    <FadeIn delay={0.3}>
                                        <ImmersiveCard className="!mt-0">
                                            <h2 className="text-xl font-bold text-gray-800 mb-4">Giờ hoạt động</h2>
                                            <OperatingHoursTab hoursData={hoursData} layout="vertical" isCard={false} />
                                        </ImmersiveCard>
                                    </FadeIn>

                                    {coreInfo.address && (
                                        <FadeIn delay={0.4}>
                                            <ImmersiveCard className="!mt-0">
                                                <LocationTab coreInfo={coreInfo} layout="vertical" isCard={false} />
                                            </ImmersiveCard>
                                        </FadeIn>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Immersive3DBackground>

            {/* Modals placed OUTSIDE to prevent z-index trapping by the 3D background */}
            <TableSelectionModal
                isOpen={isTableModalOpen}
                onClose={() => setIsTableModalOpen(false)}
                idRestaurant={idRestaurant}
                draftData={bookingDraft}
                onConfirmTable={handleTableSelected}
                variant="immersive"
            />

            <BookingConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                draftData={bookingDraft}
                variant="immersive"
            />
        </>
    );
}
