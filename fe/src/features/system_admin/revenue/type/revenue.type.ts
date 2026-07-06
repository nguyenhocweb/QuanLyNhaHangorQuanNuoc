export interface AdminRevenueRecord {
    id: string;
    brandId: string;
    brandName: string;
    brandLogo: string | null;
    planName: string;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

export interface AdminRevenueResponse {
    data: AdminRevenueRecord[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
    totalRevenue: number;
}
