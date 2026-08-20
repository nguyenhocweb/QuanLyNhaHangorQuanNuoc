export type Promotion = {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  validFrom: string; // ISO string
  validUntil: string; // ISO string
  
  // Thời gian
  daysOfWeek: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[];
  timeStart?: string | null; // HH:mm
  timeEnd?: string | null; // HH:mm

  // Tệp khách hàng & Lượt dùng
  targetAudience?: 'ALL' | 'NEW_CUSTOMER' | 'VIP' | 'STUDENT';
  conditions?: {
    targetAudience?: 'ALL' | 'NEW_CUSTOMER' | 'VIP' | 'STUDENT';
    [key: string]: any;
  } | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  usedCount: number;
  maxBudget?: number | null;
  
  image?: string | null;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'DEPLETED';
  restaurantId?: string | null;
  brandId?: string | null;
  
  // Giao diện (Mở rộng cho FE mockup)
  applicableItemNames?: string[]; // Mảng tên các món ăn áp dụng
  promotionRestaurants?: any[];
  promotionMenuItems?: {
    id: string;
    promotionId: string;
    menuItemId: string;
  }[];
};
