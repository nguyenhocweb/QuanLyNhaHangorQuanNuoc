export interface StatDetail {
    value: number;            // Giá trị thực tế (VD: 1254, 8750, 2400000)
    trendPercentage: string;  // Tỷ lệ % tăng/giảm (VD: 12.5, -5.0)
    trendType: 'up' | 'down' | 'neutral'; // Chiều hướng
    trendLabel: string;       // Nhãn thời gian (VD: "tháng trước", "YTD")
}

export interface ChartData {
    month: string;
    name: string;
    value?: number;
    users?: number;
    brands?: number;
    restaurants?: number;
    revenue?: number;
}

export interface RecentRequest {
    id: string;
    brandName: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        avatar: string | null;
    };
}

export interface Dashboard_stat_response {
    stats: {
        totalBrands: StatDetail;
        totalRestaurants: StatDetail;
        totalUsers: StatDetail;
        totalRevenue: StatDetail;
    };
    chartData: ChartData[];
    recentRequests: RecentRequest[];
}