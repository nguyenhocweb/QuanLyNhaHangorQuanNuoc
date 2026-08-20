export type ReviewStatus = "APPROVED" | "PENDING" | "REJECTED_SPAM";

export type ReviewStats = {
    total: number;
    overall: string;
    food: string;
    service: string;
    ambiance: string;
    distribution: Record<string, number>;
};

export type Review = {
    id: string;
    overall_rating: number;
    food_rating: number;
    service_rating: number;
    ambiance_rating: number;
    comment: string | null;
    images: string[];
    status: ReviewStatus;
    staff_response: string | null;
    createdAt: string;
    user: { id: string; name: string; avatar: string | null };
    reservation: { id: string; code: string };
};

export type ReviewData = {
    reviews: Review[];
    stats: ReviewStats;
};