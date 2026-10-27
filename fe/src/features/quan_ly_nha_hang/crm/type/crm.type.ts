export interface CrmAnalyticsData {
  totalCustomers: number;
  tiers: {
    NEW: number;
    MEMBER: number;
    SILVER: number;
    GOLD: number;
    VIP: number;
  };
  customersList?: any[]; // Chi tiết sẽ tùy biến sau
}
