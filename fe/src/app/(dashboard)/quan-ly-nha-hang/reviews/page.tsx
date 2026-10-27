"use client";
import { ReviewList } from "@/src/features/quan_ly_nha_hang/reviews/component/ReviewList";
import FadeIn from "@/src/core/components/animation/FadeIn";

export default function Page() {
    return (
        <FadeIn className="w-full">
            <ReviewList />
        </FadeIn>
    );
}