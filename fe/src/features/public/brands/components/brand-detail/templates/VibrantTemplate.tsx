import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileContract, FaCheckCircle, FaStar } from "react-icons/fa";
import BrandDetailEcosystem from "../BrandDetailEcosystem";

interface VibrantTemplateProps {
    data: any;
    idBrand: string;
}

const VibrantTemplate = ({ data, idBrand }: VibrantTemplateProps) => {
    if (!data) return null;

    const coverImage = data.imageMain || (data.images && data.images.length > 0 ? data.images[0] : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop");
    const isUrlLogo = data.logo && (data.logo.startsWith("http") || data.logo.startsWith("/"));
    const logoText = data.logo ? data.logo.substring(0, 3).toUpperCase() : data.name ? data.name.substring(0, 2).toUpperCase() : "VIP";

    const getAddressString = () => {
        if (!data.address) return "Trụ sở toàn quốc";
        if (typeof data.address === "string") return data.address;
        return data.address.city || data.address.province || data.address.street || data.address.address || "TP. Hồ Chí Minh";
    };

    return (
        <div className="w-full min-h-screen bg-[#FFF0E5] text-[#2D2D2D] font-sans overflow-hidden animate-fade-in pb-20">
            {/* Vibrant Hero */}
            <div className="relative w-full py-16 md:py-24 px-4 flex flex-col items-center justify-center text-center">
                {/* Decorative floating shapes */}
                <div className="absolute top-10 left-[10%] w-24 h-24 sm:w-40 sm:h-40 bg-[#FF6B6B] rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
                <div className="absolute top-20 right-[10%] w-32 h-32 sm:w-56 sm:h-56 bg-[#4ECDC4] rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-[20%] w-32 h-32 sm:w-48 sm:h-48 bg-[#FFE66D] rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '4s' }}></div>

                <div className="relative z-10 w-full max-w-4xl">
                    {/* Floating Logo Badge */}
                    <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-[#2D2D2D] shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] flex items-center justify-center overflow-hidden z-20 hover:scale-110 transition-transform">
                        {isUrlLogo ? (
                            <Image src={data.logo} alt="Logo" fill className="object-cover p-2" />
                        ) : (
                            <span className="text-2xl sm:text-4xl font-black text-[#FF6B6B] tracking-wider">
                                {logoText}
                            </span>
                        )}
                    </div>
                    
                    {/* Main Hero Card */}
                    <div className="bg-white p-8 sm:p-12 pt-16 sm:pt-20 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(45,45,45,1)] border-4 border-[#2D2D2D] w-full mt-12 transition-transform duration-300">
                        <div className="flex justify-center gap-3 mb-4">
                            {data.isFeatured && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE66D] text-[#2D2D2D] border-2 border-[#2D2D2D] font-black text-xs sm:text-sm">
                                    <FaStar /> Nổi bật
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4ECDC4] text-white border-2 border-[#2D2D2D] font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]">
                                <FaCheckCircle /> Xác thực
                            </span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-[#FF6B6B] tracking-tight leading-none uppercase">
                            {data?.name || "Tên Thương Hiệu"}
                        </h1>
                        <p className="text-lg sm:text-xl font-bold mb-8 text-gray-700 max-w-2xl mx-auto">
                            {data?.subscriptions?.[0]?.plan?.name || "Sôi động, trẻ trung và bùng nổ hương vị!"}
                        </p>
                        
                        <a href="#ecosystem" className="inline-block bg-[#FFE66D] hover:bg-[#ffd739] text-[#2D2D2D] text-lg sm:text-xl font-black py-3 sm:py-4 px-6 sm:px-8 rounded-2xl border-4 border-[#2D2D2D] shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            Khám phá Menu
                        </a>
                    </div>
                </div>
            </div>

            {/* Cover Image Brutalism Style */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
                <div className="relative w-full h-[30vh] sm:h-[40vh] rounded-[2rem] border-4 border-[#2D2D2D] shadow-[8px_8px_0px_0px_rgba(45,45,45,1)] overflow-hidden bg-white">
                    <Image
                        src={coverImage}
                        alt="Banner"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Vibrant Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Story / About */}
                    <div className="lg:col-span-8 bg-[#4ECDC4] p-6 sm:p-10 rounded-[2rem] border-4 border-[#2D2D2D] shadow-[8px_8px_0px_0px_rgba(45,45,45,1)] text-white">
                        <h2 className="text-3xl sm:text-4xl font-black mb-6 flex items-center gap-3 uppercase">
                            <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4ECDC4] text-xl border-4 border-[#2D2D2D]">
                                😲
                            </span>
                            Câu chuyện 
                        </h2>
                        <div className="text-lg sm:text-xl font-bold leading-relaxed space-y-4">
                            <p className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30">
                                {data?.description || "Chúng tôi mang đến một làn gió mới cho thế giới ẩm thực. Không chỉ là ăn ngon, mà còn là phong cách sống!"}
                            </p>
                        </div>
                    </div>
                    
                    {/* Contacts block */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border-4 border-[#2D2D2D] shadow-[6px_6px_0px_0px_rgba(45,45,45,1)]">
                            <h3 className="text-xl font-black uppercase mb-4 text-[#FF6B6B]">Thông tin</h3>
                            <ul className="space-y-4 font-bold text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#2D2D2D] flex items-center justify-center shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <span className="mt-1 leading-tight">{getAddressString()}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#2D2D2D] flex items-center justify-center shrink-0">
                                        <FaPhoneAlt />
                                    </div>
                                    <span>{data?.phone_contact || "Liên hệ qua Website"}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#2D2D2D] flex items-center justify-center shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <span className="truncate">{data?.email_contact || "Liên hệ qua Website"}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#2D2D2D] flex items-center justify-center shrink-0">
                                        <FaGlobe />
                                    </div>
                                    <span className="truncate">{data?.link || "Chưa có website"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                </div>
                
                {/* Ecosystem block wrapped for Brutalism context */}
                <div id="ecosystem" className="bg-white p-6 sm:p-10 rounded-[2rem] border-4 border-[#2D2D2D] shadow-[12px_12px_0px_0px_rgba(45,45,45,1)]">
                    <BrandDetailEcosystem idBrand={idBrand} brandName={data?.name} />
                </div>
                
            </div>
        </div>
    );
};

export default VibrantTemplate;
