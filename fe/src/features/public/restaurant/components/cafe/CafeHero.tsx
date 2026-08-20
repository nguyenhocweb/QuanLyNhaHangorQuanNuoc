import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar, FaClock } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface CafeHeroProps {
    coreInfo: IPublicRestaurantCore;
}

export default function CafeHero({ coreInfo }: CafeHeroProps) {
    const bannerUrl = coreInfo.imageMain || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop";

    return (
        <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image with warm overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={bannerUrl}
                    alt={coreInfo.name}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Warm Coffee Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E16] via-[#3E2723]/70 to-[#4E342E]/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                {/* Logo */}
                {coreInfo.logo && (
                    <div className="mb-6 rounded-full p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#DCCCBD]">
                            <Image
                                src={coreInfo.logo}
                                alt={`${coreInfo.name} Logo`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight font-serif drop-shadow-md">
                    {coreInfo.name}
                </h1>

                <p className="text-lg md:text-xl text-[#F0EAE1] mb-8 font-light max-w-2xl drop-shadow">
                    {coreInfo.description || "Nơi thưởng thức hương vị cà phê đích thực và không gian thư giãn tuyệt vời."}
                </p>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 bg-[#FAF5F0]/90 backdrop-blur-sm text-[#5C4033] px-5 py-2.5 rounded-full shadow-lg border border-[#DCCCBD]/50 transition-transform hover:-translate-y-1">
                        <FaMapMarkerAlt className="text-[#8B5A2B]" />
                        <span className="truncate max-w-[250px]">
                            {coreInfo.address?.district}, {coreInfo.address?.province}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#FAF5F0]/90 backdrop-blur-sm text-[#5C4033] px-5 py-2.5 rounded-full shadow-lg border border-[#DCCCBD]/50 transition-transform hover:-translate-y-1">
                        <FaStar className="text-yellow-500" />
                        <span>{coreInfo.averageRating.toFixed(1)} ({coreInfo.totalRating} đánh giá)</span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#8B5A2B]/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-lg border border-[#8B5A2B] transition-transform hover:-translate-y-1">
                        <FaClock className="text-[#F0EAE1]" />
                        <span>Mở cửa hôm nay</span>
                    </div>
                </div>
            </div>

            {/* Bottom Curve Divider */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FDFBF7]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
        </div>
    );
}
