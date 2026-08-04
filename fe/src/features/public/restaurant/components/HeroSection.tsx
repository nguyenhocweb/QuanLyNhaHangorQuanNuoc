import React from "react";
import Image from "next/image";
import { IPublicRestaurantCore, IOperatingHour, IPublicHoursData } from "../type/restaurant.public.type";
import { FaMapMarkerAlt, FaStar, FaClock, FaPhoneAlt } from "react-icons/fa";

interface Props {
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

const HeroSection: React.FC<Props> = ({ coreInfo, hoursData }) => {
    // Logic kiểm tra giờ mở cửa đơn giản
    const currentDay = new Date().getDay(); // 0 = Sunday
    const todayHours = hoursData?.operating_hours?.find(h => h.day_of_week === currentDay);
    const isOpen = todayHours && !todayHours.is_closed;

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "";
        return timeStr.slice(0, 5); // "08:00:00" -> "08:00"
    };

    return (
        <div className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src={coreInfo.imageMain || "/placeholder.jpg"} 
                    alt={coreInfo.name} 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex items-end gap-6 flex-1">
                    {/* Logo */}
                    <div className="hidden md:flex w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0 items-center justify-center">
                        {coreInfo.logo ? (
                            <Image 
                                src={coreInfo.logo} 
                                alt="Logo" 
                                width={128} 
                                height={128} 
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <span className="text-4xl font-bold text-gray-500 tracking-wider">
                                {coreInfo.name?.substring(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Text Info */}
                    <div className="text-white flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} shadow-md backdrop-blur-md`}>
                                    {isOpen ? "ĐANG MỞ CỬA" : "ĐÃ ĐÓNG CỬA"}
                                </span>
                                {todayHours && !todayHours.is_closed && (
                                    <span className="text-sm font-semibold bg-black/40 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm flex items-center gap-2">
                                        <FaClock className="text-amber-400" />
                                        {formatTime(todayHours.open_time)} - {formatTime(todayHours.close_time)}
                                    </span>
                                )}
                                {coreInfo.phone_contact && (
                                    <a href={`tel:${coreInfo.phone_contact}`} className="text-sm font-semibold bg-indigo-600/90 hover:bg-indigo-600 px-4 py-1 rounded-full border border-indigo-500 backdrop-blur-sm flex items-center gap-2 transition-colors">
                                        <FaPhoneAlt className="text-white" />
                                        {coreInfo.phone_contact}
                                    </a>
                                )}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">{coreInfo.name}</h1>
                        <div className="flex flex-col sm:flex-row gap-4 text-gray-200 text-sm font-medium drop-shadow-md">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-indigo-400" />
                                <span>{coreInfo.address?.street}, {coreInfo.address?.district}, {coreInfo.address?.province}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaStar className="text-amber-400" />
                                <span>{coreInfo.averageRating?.toFixed(1)} ({coreInfo.totalRating} đánh giá)</span>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default HeroSection;
