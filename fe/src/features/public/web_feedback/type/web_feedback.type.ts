export type FeedbackStatus = "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
export type FeedbackCategory = "UI_UX" | "PERFORMANCE" | "FEATURE" | "BUG_REPORT" | "GENERAL";

export interface IWebFeedback {
  id: string;
  guestName?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  category: FeedbackCategory;
  isFeatured: boolean;
  adminReply?: string | null;
  repliedAt?: string | null;
  isHelpfulCount: number;
  createdAt: string;
}

export interface IFeedbackStats {
  totalReviews: number;
  averageRating: number;
}

export interface IPublicFeedbacksResponse {
  feedbacks: IWebFeedback[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: IFeedbackStats;
}
