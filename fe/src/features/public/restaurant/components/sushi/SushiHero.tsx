import React from "react";
import Image from "next/image";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";
import { FaMapMarkerAlt, FaStar, FaClock, FaPhoneAlt } from "react-icons/fa";
import { GiSushis } from "react-icons/gi";

interface Props {
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

const SushiHero: React.FC<Props> = ({ coreInfo, hoursData }) => {
    const currentDay = new Date().getDay();
    const todayHours = hoursData?.operating_hours?.find(h => h.day_of_week === currentDay);
    const isOpen = todayHours && !todayHours.is_closed;

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "";
        return timeStr.slice(0, 5);
    };

    return (
        <div className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0F0F0F]">
            {/* Background Image with Dark Gradient */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src={coreInfo.imageMain || "/placeholder.jpg"} 
                    alt={coreInfo.name} 
                    fill 
                    className="object-cover transition-transform duration-[30s] ease-linear scale-110 hover:scale-100 opacity-60"
                />
                {/* Dark gradient for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#121212]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/80 via-transparent to-[#0F0F0F]/80"></div>
            </div>

            {/* Pattern Overlay (Japanese wave/seigaiha subtle pattern) */}
            <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D32F2F\' fill-opacity=\'1\'%3E%3Cpath d=\'M30 30c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm-15 0c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm-15 0C0 21.716 6.716 15 15 15s15 6.716 15 15-6.716 15-15 15S0 38.284 0 30z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

            {/* Content centered */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12 flex flex-col items-center">
                
                {/* Logo */}
                <div className="mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.2)] bg-[#1A1A1A] flex items-center justify-center mb-8 relative">
                    {/* Inner gold ring */}
                    <div className="absolute inset-1 border border-[#D4AF37]/50 rounded-full"></div>
                    {coreInfo.logo ? (
                        <Image 
                            src={coreInfo.logo} 
                            alt="Logo" 
                            width={128} 
                            height={128} 
                            className="object-contain w-full h-full p-4 relative z-10"
                        />
                    ) : (
                        <GiSushis className="text-5xl text-[#D32F2F] relative z-10" />
                    )}
                </div>

                <div className="bg-[#121212]/70 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-[#333] relative overflow-hidden w-full max-w-3xl">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent"></div>

                    <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                        <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase ${isOpen ? 'bg-[#D32F2F] text-white shadow-[0_0_15px_rgba(211,47,47,0.5)]' : 'bg-[#333] text-[#A0A0A0]'} border border-transparent`}>
                            {isOpen ? "ĐANG MỞ CỬA" : "ĐÃ ĐÓNG CỬA"}
                        </span>
                        {todayHours && !todayHours.is_closed && (
                            <span className="text-sm font-medium text-[#EAEAEA] bg-[#1A1A1A]/80 px-4 py-1 rounded-full border border-[#404040] flex items-center gap-2">
                                <FaClock className="text-[#D4AF37]" />
                                {formatTime(todayHours.open_time)} - {formatTime(todayHours.close_time)}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-4 leading-tight tracking-wide">
                        {coreInfo.name}
                    </h1>
                    
                    <p className="text-[#D4AF37] font-serif italic text-lg sm:text-xl mb-8 flex items-center justify-center gap-4">
                        <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
                        Nghệ thuật Omakase & Sushi cao cấp
                        <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-[#A0A0A0] text-sm font-medium border-t border-[#333] pt-6">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-[#D32F2F]" />
                            <span>{coreInfo.address?.district}, {coreInfo.address?.province}</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-[#404040]"></div>
                        <div className="flex items-center gap-2">
                            <FaStar className="text-[#D4AF37]" />
                            <span className="text-[#EAEAEA]">{coreInfo.averageRating?.toFixed(1)} <span className="text-[#A0A0A0]">({coreInfo.totalRating} đánh giá)</span></span>
                        </div>
                        {coreInfo.phoneContact && (
                            <>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-[#404040]"></div>
                                <a href={`tel:${coreInfo.phoneContact}`} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                                    <FaPhoneAlt className="text-[#D32F2F]" />
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

export default SushiHero;
