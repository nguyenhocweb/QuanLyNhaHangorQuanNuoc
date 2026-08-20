export interface BrandLoyalty {
  id: string;
  brandId: string;
  userId: string;
  totalSpent: number;
  loyaltyPoints: number;
  orderCount: number;
  tier: "NEW" | "SILVER" | "GOLD" | "VIP" | "DIAMOND";
  brand: {
    id: string;
    name: string;
    logo: string | null;
  };
}

export interface RestaurantLoyalty {
  id: string;
  restaurantId: string;
  userId: string;
  totalSpent: number;
  loyaltyPoints: number;
  orderCount: number;
  tier: "NEW" | "SILVER" | "GOLD" | "VIP" | "DIAMOND";
  restaurant: {
    id: string;
    name: string;
    imageMain: string | null;
  };
}

export interface LoyaltyInfoResponse {
  brands: BrandLoyalty[];
  restaurants: RestaurantLoyalty[];
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  restaurantId: string | null;
  brandId: string | null;
  points: number;
  type: "EARN" | "SPEND" | "EXPIRED";
  description: string | null;
  createdAt: string;
}
