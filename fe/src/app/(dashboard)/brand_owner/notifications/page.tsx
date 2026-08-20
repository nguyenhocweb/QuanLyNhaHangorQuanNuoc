"use client";
import React from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { NotificationList } from "@/src/features/customer/notifications/components/NotificationList";

export default function BrandNotificationsPage() {
    return (
        <FadeIn className="w-full flex flex-col gap-8 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <NotificationList />
        </FadeIn>
    );
}
