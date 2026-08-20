"use client";
import { ReviewList } from "@/src/features/restaurant_manager/reviews/component/ReviewList";
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function Page() {
    return (
        <FadeIn className="w-full">
            <ReviewList />
        </FadeIn>
    );
}