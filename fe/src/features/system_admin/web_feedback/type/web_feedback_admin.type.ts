export type FeedbackStatus = "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
export type FeedbackCategory = "UI_UX" | "PERFORMANCE" | "FEATURE" | "BUG_REPORT" | "GENERAL";

export interface IAdminWebFeedback {
  id: string;
  userId?: string | null;
  isGuest: boolean;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  category: FeedbackCategory;
  pageUrl?: string | null;
  deviceInfo?: string | null;
  screenResolution?: string | null;
  attachments?: string[];
  status: FeedbackStatus;
  isFeatured: boolean;
  adminNote?: string | null;
  adminReply?: string | null;
  repliedAt?: string | null;
  reviewedBy?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  isHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminFeedbacksResponse {
  feedbacks: IAdminWebFeedback[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAdminFeedbacksParams {
  page?: number;
  limit?: number;
  status?: FeedbackStatus;
  category?: FeedbackCategory;
  rating?: number;
  search?: string;
  isFeatured?: boolean;
}

export interface UpdateAdminFeedbackPayload {
  status?: FeedbackStatus;
  isFeatured?: boolean;
  adminNote?: string;
  adminReply?: string;
}
