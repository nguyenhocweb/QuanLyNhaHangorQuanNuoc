export interface ReportOverview {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    orders: number;
}

export interface BranchRevenue {
    restaurantId: string;
    restaurantName: string;
    revenue: number;
    orders: number;
}

export interface TopSellingItem {
    menuItemId: string;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
}

export interface ReportResponse {
    overview: ReportOverview;
    dailyRevenue: DailyRevenue[];
    revenueByBranch: BranchRevenue[];
    topSellingItems: TopSellingItem[];
}
