import React from "react";
import Image from "next/image";
import { FaFireAlt, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

export default function HotpotHero({ coreInfo }: Props) {
    const mainImage = coreInfo.imageMain;

    return (
        <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-[#111111] group">
            {/* Background Image with intense overlay */}
            <div className="absolute inset-0">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={coreInfo.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-[20s] ease-out"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                        <span className="text-[#555555] font-bold text-4xl uppercase tracking-widest">Ảnh Chính</span>
                    </div>
                )}
                {/* Red to Black Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-[#D32F2F]/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/50 to-transparent" />
            </div>

            {/* Fire particles / Accent decor */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-20 w-32 h-32 bg-[#D32F2F] rounded-full mix-blend-screen filter blur-[80px] opacity-60"></div>
                <div className="absolute bottom-40 right-40 w-48 h-48 bg-[#FF7043] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
                <div className="absolute bottom-10 left-20 w-40 h-40 bg-[#D32F2F] rounded-full mix-blend-screen filter blur-[90px] opacity-50"></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-3xl pt-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D32F2F]/20 border border-[#D32F2F]/50 rounded-full text-[#FF7043] font-bold text-sm mb-6 backdrop-blur-sm animate-pulse-slow">
                        <FaFireAlt className="text-[#D32F2F]" />
                        <span className="uppercase tracking-widest">Spicy & Hot</span>
                    </div>

                    {/* Logo & Title */}
                    <div className="flex items-center gap-6 mb-6">
                        {coreInfo.logo && (
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#D32F2F] shadow-[0_0_30px_rgba(211,47,47,0.4)] flex-shrink-0 bg-white p-1">
                                <Image
                                    src={coreInfo.logo}
                                    alt={`${coreInfo.name} Logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase" style={{ textShadow: '4px 4px 0px rgba(211, 47, 47, 0.5)' }}>
                            {coreInfo.name}
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl text-[#E0E0E0] mb-10 font-medium max-w-2xl leading-relaxed border-l-4 border-[#D32F2F] pl-6">
                        {coreInfo.description || "Trải nghiệm ẩm thực lẩu nướng thăng hoa với hương vị đặc trưng, đánh thức mọi giác quan của bạn."}
                    </p>

                    {/* Quick Info Tags */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 bg-[#1A1A1A]/80 backdrop-blur-md text-[#E0E0E0] px-5 py-3 rounded-lg border border-[#333333] hover:border-[#D32F2F] transition-colors cursor-default shadow-lg">
                            <FaMapMarkerAlt className="text-[#D32F2F] text-xl" />
                            <span className="truncate max-w-[250px] font-medium">
                                {coreInfo.address?.district}, {coreInfo.address?.province}
                            </span>
                        </div>
                        {coreInfo.phoneContact && (
                            <a href={`tel:${coreInfo.phoneContact}`} className="flex items-center gap-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 rounded-lg transition-colors shadow-[0_0_20px_rgba(211,47,47,0.3)] font-bold">
                                <FaPhoneAlt className="text-white" />
                                <span>{coreInfo.phoneContact}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Diagonal Cut */}
            <div className="absolute bottom-[-1px] left-0 w-full leading-[0] text-[#141414]">
                <svg viewBox="0 0 1440 120" className="w-full h-16 fill-current" preserveAspectRatio="none">
                    <polygon points="0,120 1440,120 1440,0 0,120" />
                </svg>
            </div>
        </div>
    );
}
