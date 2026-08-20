"use client";
import { Div, H, P } from "@/src/core/components/ui";
import { BrandLoyalty, RestaurantLoyalty } from "../type/loyalty.type";
import { FaCrown, FaStar } from "react-icons/fa";
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

interface LoyaltyCardProps {
  data: BrandLoyalty | RestaurantLoyalty;
  type: "BRAND" | "RESTAURANT";
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "SILVER":
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
    case "GOLD":
      return "bg-gradient-to-r from-yellow-300 to-yellow-600 text-yellow-900";
    case "VIP":
      return "bg-gradient-to-r from-purple-400 to-indigo-600 text-white";
    case "DIAMOND":
      return "bg-gradient-to-r from-cyan-300 to-blue-600 text-white";
    default: // NEW
      return "bg-gradient-to-r from-slate-700 to-slate-900 text-white";
  }
};

const getNextTier = (tier: string) => {
  switch (tier) {
    case "NEW": return { name: "SILVER", threshold: 1000000 };
    case "SILVER": return { name: "GOLD", threshold: 5000000 };
    case "GOLD": return { name: "VIP", threshold: 20000000 };
    case "VIP": return { name: "DIAMOND", threshold: 50000000 };
    default: return null;
  }
};

export const LoyaltyCard = ({ data, type }: LoyaltyCardProps) => {
  const name = type === "BRAND" ? (data as BrandLoyalty).brand.name : (data as RestaurantLoyalty).restaurant.name;
  const logo = type === "BRAND" ? (data as BrandLoyalty).brand.logo : (data as RestaurantLoyalty).restaurant.imageMain;
  
  const nextTier = getNextTier(data.tier);
  const progress = nextTier ? Math.min(100, (data.totalSpent / nextTier.threshold) * 100) : 100;

  return (
    <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-lg overflow-hidden ${getTierColor(data.tier)} transition-all duration-300 hover:shadow-xl`}>
      {/* Background pattern */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="w-12 h-12 rounded-full bg-white p-1 overflow-hidden">
                <img src={logo} alt={name} className="w-full h-full object-cover rounded-full" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <FaStar className="text-xl opacity-80" />
              </div>
            )}
            <div>
              <H type="h4" className="font-bold tracking-tight opacity-90 leading-tight">
                {name}
              </H>
              <P type="p5" className="opacity-70 uppercase tracking-widest text-[10px] font-semibold">
                Thẻ Thành Viên
              </P>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 font-black text-xl italic tracking-wider">
              {data.tier === "VIP" || data.tier === "DIAMOND" ? <FaCrown className="text-sm" /> : null}
              {data.tier}
            </span>
          </div>
        </div>

        {/* Body - Points */}
        <div className="flex flex-col gap-1">
          <P type="p4" className="opacity-80">Điểm tích luỹ</P>
          <H type="h2" className="font-bold text-4xl">{data.loyaltyPoints.toLocaleString()}</H>
        </div>

        {/* Footer - Progress */}
        {nextTier && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-end text-xs opacity-80 font-medium">
              <span>Đã chi: {formatCurrency(data.totalSpent)}</span>
              <span>Lên {nextTier.name}: {formatCurrency(nextTier.threshold)}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
