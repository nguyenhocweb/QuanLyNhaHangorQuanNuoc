import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar, FaIceCream } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface IceCreamHeroProps {
    coreInfo: IPublicRestaurantCore;
}

export default function IceCreamHero({ coreInfo }: IceCreamHeroProps) {
    const heroImage = coreInfo.imageMain || "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=2000&auto=format&fit=crop";

    return (
        <div className="relative w-full h-[550px] md:h-[650px] bg-[#FFF8F0] overflow-hidden">
            {/* Background Image with Sweet Gradient Overlay */}
            <div className="absolute inset-0">
                <Image
                    src={heroImage}
                    alt={coreInfo.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB7B2]/80 via-[#E2F0CB]/60 to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F0] via-white/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-8">
                {/* Logo */}
                {coreInfo.logo && (
                    <div className="mb-6 bg-white p-2 rounded-[32px] shadow-[0_10px_30px_rgba(255,139,167,0.3)] transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                        <div className="relative w-32 h-32 rounded-[24px] overflow-hidden">
                            <Image
                                src={coreInfo.logo}
                                alt={`${coreInfo.name} Logo`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}

                <h1 className="text-5xl md:text-7xl font-extrabold text-[#FF8BA7] mb-4 tracking-tight font-sans drop-shadow-sm px-4">
                    {coreInfo.name}
                </h1>

                <p className="text-lg md:text-xl text-[#5D4037] mb-8 font-medium max-w-2xl px-4 bg-white/50 backdrop-blur-sm py-3 rounded-full border border-white/60 shadow-sm">
                    {coreInfo.description || "Thế giới kem ngọt ngào và những món tráng miệng mát lạnh."}
                </p>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
                    <div className="flex items-center gap-2 bg-white text-[#FF8BA7] px-6 py-3 rounded-[20px] shadow-sm border border-[#FFE3E9] hover:scale-105 transition-transform">
                        <FaMapMarkerAlt className="text-lg" />
                        <span className="truncate max-w-[250px] text-[#5D4037]">
                            {coreInfo.address?.district}, {coreInfo.address?.province}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white text-[#FF8BA7] px-6 py-3 rounded-[20px] shadow-sm border border-[#FFE3E9] hover:scale-105 transition-transform">
                        <FaStar className="text-yellow-400 text-lg" />
                        <span className="text-[#5D4037]">{coreInfo.averageRating?.toFixed(1) || 0} <span className="text-[#8D6E63] font-normal">({coreInfo.totalRating} đánh giá)</span></span>
                    </div>
                </div>
            </div>

            {/* Wavy bottom divider */}
            <div className="absolute bottom-0 w-full leading-[0] transform translate-y-[1px]">
                <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-[#FFF8F0] fill-current">
                    <path d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 80C672 90 768 90 864 75C960 60 1056 30 1152 20C1248 10 1344 20 1392 25L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"></path>
                </svg>
            </div>
        </div>
    );
}
