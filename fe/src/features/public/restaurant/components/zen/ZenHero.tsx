import React from "react";
import Image from "next/image";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";
import { FaMapMarkerAlt, FaStar, FaClock, FaPhoneAlt, FaLeaf } from "react-icons/fa";

interface Props {
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

const ZenHero: React.FC<Props> = ({ coreInfo, hoursData }) => {
    const currentDay = new Date().getDay();
    const todayHours = hoursData?.operating_hours?.find(h => h.day_of_week === currentDay);
    const isOpen = todayHours && !todayHours.is_closed;

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "";
        return timeStr.slice(0, 5);
    };

    return (
        <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax feel */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src={coreInfo.imageMain || "/placeholder.jpg"} 
                    alt={coreInfo.name} 
                    fill 
                    className="object-cover transition-transform duration-[20s] ease-linear scale-110 hover:scale-100"
                />
                {/* Soft natural gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/40 via-[#2c3e2e]/20 to-[#fdfbf7]"></div>
            </div>

            {/* Zen Overlay Elements (Leaves/Particles effect can be added here) */}
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234d7c0f\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

            {/* Content centered, zen style */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-20">
                {/* Minimalist Logo */}
                <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#fffaf0] shadow-[0_10px_30px_rgba(77,124,15,0.2)] bg-[#fffaf0] flex items-center justify-center mb-8">
                    {coreInfo.logo ? (
                        <Image 
                            src={coreInfo.logo} 
                            alt="Logo" 
                            width={128} 
                            height={128} 
                            className="object-contain w-full h-full p-2"
                        />
                    ) : (
                        <FaLeaf className="text-4xl text-[#4d7c0f]" />
                    )}
                </div>

                <div className="bg-[#fffaf0]/80 backdrop-blur-md p-8 sm:p-12 rounded-[40px] shadow-[0_20px_40px_rgba(44,62,46,0.08)] border border-white">
                    <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${isOpen ? 'bg-[#4d7c0f] text-white' : 'bg-[#5c6655] text-white'} shadow-sm`}>
                            {isOpen ? "ĐANG PHỤC VỤ" : "ĐÃ ĐÓNG CỬA"}
                        </span>
                        {todayHours && !todayHours.is_closed && (
                            <span className="text-sm font-medium text-[#4a4036] bg-white/50 px-4 py-1.5 rounded-full border border-[#efece5] flex items-center gap-2">
                                <FaClock className="text-[#4d7c0f]" />
                                {formatTime(todayHours.open_time)} - {formatTime(todayHours.close_time)}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium text-[#2c3e2e] mb-4 leading-tight">
                        {coreInfo.name}
                    </h1>
                    
                    <p className="text-[#5c6655] font-sans italic text-lg sm:text-xl mb-6 flex items-center justify-center gap-2">
                        <FaLeaf className="text-[#4d7c0f] text-sm" />
                        Nhà hàng chay & Ẩm thực thực dưỡng
                        <FaLeaf className="text-[#4d7c0f] text-sm" />
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-[#5c6655] text-sm font-medium border-t border-[#efece5] pt-6">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-[#4d7c0f]" />
                            <span>{coreInfo.address?.district}, {coreInfo.address?.province}</span>
                        </div>
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#d2d6c9]"></div>
                        <div className="flex items-center gap-2">
                            <FaStar className="text-[#eab308]" />
                            <span>{coreInfo.averageRating?.toFixed(1)} ({coreInfo.totalRating} đánh giá)</span>
                        </div>
                        {coreInfo.phoneContact && (
                            <>
                                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#d2d6c9]"></div>
                                <a href={`tel:${coreInfo.phoneContact}`} className="flex items-center gap-2 hover:text-[#4d7c0f] transition-colors">
                                    <FaPhoneAlt className="text-[#4d7c0f]" />
                                    {coreInfo.phoneContact}
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZenHero;
