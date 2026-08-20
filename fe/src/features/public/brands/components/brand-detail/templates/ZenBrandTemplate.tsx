import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileContract, FaCheckCircle, FaStar, FaLeaf } from "react-icons/fa";
import BrandDetailEcosystem from "../BrandDetailEcosystem";

interface ZenBrandTemplateProps {
    data: any;
    idBrand: string;
}

const ZenBrandTemplate = ({ data, idBrand }: ZenBrandTemplateProps) => {
    if (!data) return null;

    const coverImage = data.imageMain || (data.images && data.images.length > 0 ? data.images[0] : "https://images.unsplash.com/photo-1498837167922-41c543789cc5?q=80&w=1200&auto=format&fit=crop");
    const isUrlLogo = data.logo && (data.logo.startsWith("http") || data.logo.startsWith("/"));
    const logoText = data.logo ? data.logo.substring(0, 3).toUpperCase() : data.name ? data.name.substring(0, 2).toUpperCase() : "ZEN";

    const getAddressString = () => {
        if (!data.address) return "Trụ sở toàn quốc";
        if (typeof data.address === "string") return data.address;
        return data.address.city || data.address.province || data.address.street || data.address.address || "TP. Hồ Chí Minh";
    };

    return (
        <div className="w-full min-h-screen bg-[#f9f8f3] text-[#333a2f] pb-20 animate-fade-in font-serif">
            {/* Zen Hero Banner */}
            <div className="w-full relative">
                <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
                    <Image
                        src={coverImage}
                        alt={data.name || "Brand Cover"}
                        fill
                        className="object-cover opacity-80 mix-blend-multiply"
                        priority
                    />
                    {/* Soft gradient fading into background color */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f9f8f3] via-[#f9f8f3]/40 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-8 md:gap-12 translate-y-12">
                        {/* Organic Logo (Wabi-sabi style) */}
                        <div 
                            className="w-32 h-32 md:w-40 md:h-40 bg-[#f9f8f3] shadow-md border border-[#e8e6d9] flex items-center justify-center overflow-hidden flex-shrink-0 z-10 transition-transform duration-700 hover:scale-105"
                            style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
                        >
                            {isUrlLogo ? (
                                <Image src={data.logo} alt="Logo" fill className="object-cover p-2" style={{ borderRadius: "inherit" }} />
                            ) : (
                                <span className="text-3xl font-black text-[#5c7a46] tracking-wider">
                                    {logoText}
                                </span>
                            )}
                        </div>
                        
                        {/* Title & Badges */}
                        <div className="flex-1 pb-4 z-10">
                            <div className="flex items-center gap-3 mb-4 font-sans">
                                {data.isFeatured && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f9f8f3] border border-[#5c7a46]/30 text-[#5c7a46] font-medium text-xs shadow-sm">
                                        <FaStar className="text-amber-500" /> Tinh hoa mộc thực
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5c7a46]/10 text-[#5c7a46] font-medium text-xs">
                                    <FaLeaf /> {data.isActive === "ACTIVE" ? "Đã xác thực" : "Hoạt động"}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#333a2f] tracking-tight leading-tight">
                                {data.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        
            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-32">
                
                {/* Description */}
                {data.description && (
                    <div className="mb-16 md:px-12 text-center">
                        <div className="w-12 h-1 bg-[#5c7a46]/30 mx-auto mb-8 rounded-full"></div>
                        <p className="text-lg md:text-xl text-[#5c6655] leading-relaxed whitespace-pre-line font-medium italic">
                            "{data.description}"
                        </p>
                        <div className="w-12 h-1 bg-[#5c7a46]/30 mx-auto mt-8 rounded-full"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 font-sans">
                    
                    {/* Main Column - Ecosystem */}
                    <div className="col-span-1 lg:col-span-2 space-y-12">
                        <div className="w-full">
                            <BrandDetailEcosystem idBrand={idBrand} brandName={data?.name} grid={2} variant="zen" />
                        </div>
                    </div>

                    {/* Sidebar - Contact & Info */}
                    <div className="col-span-1">
                        <div className="sticky top-28 bg-[#fffdfa] p-8 rounded-[2rem] border border-[#e8e6d9] shadow-[0_8px_30px_rgba(92,122,70,0.04)] space-y-8">
                            <div>
                                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-[#e8e6d9] text-[#333a2f] flex items-center gap-2 font-serif">
                                    <span className="w-1.5 h-6 bg-[#5c7a46] rounded-full inline-block"></span>
                                    Thông tin liên hệ
                                </h2>
                                <ul className="space-y-6 text-sm">
                                    <li className="flex flex-col gap-1 text-[#757d6b]">
                                        <div className="flex items-center gap-2 text-[#5c7a46] font-semibold">
                                            <FaMapMarkerAlt /> Trụ sở chính
                                        </div>
                                        <div className="pl-6">{getAddressString()}</div>
                                    </li>
                                    <li className="flex flex-col gap-1 text-[#757d6b]">
                                        <div className="flex items-center gap-2 text-[#5c7a46] font-semibold">
                                            <FaPhoneAlt /> Hotline
                                        </div>
                                        <a href={`tel:${data.phoneContact}`} className="pl-6 hover:text-[#5c7a46] transition-colors">{data.phoneContact || "Đang cập nhật"}</a>
                                    </li>
                                    <li className="flex flex-col gap-1 text-[#757d6b]">
                                        <div className="flex items-center gap-2 text-[#5c7a46] font-semibold">
                                            <FaEnvelope /> Email
                                        </div>
                                        <a href={`mailto:${data.emailContact}`} className="pl-6 hover:text-[#5c7a46] transition-colors">{data.emailContact || "Đang cập nhật"}</a>
                                    </li>
                                    <li className="flex flex-col gap-1 text-[#757d6b]">
                                        <div className="flex items-center gap-2 text-[#5c7a46] font-semibold">
                                            <FaGlobe /> Website
                                        </div>
                                        <a href={data.link || "#"} target="_blank" rel="noopener noreferrer" className="pl-6 hover:text-[#5c7a46] transition-colors truncate">{data.link || "Đang cập nhật"}</a>
                                    </li>
                                    <li className="flex flex-col gap-1 text-[#757d6b]">
                                        <div className="flex items-center gap-2 text-[#5c7a46] font-semibold">
                                            <FaFileContract /> Mã số thuế
                                        </div>
                                        <div className="pl-6">{data.taxCode || "Đang cập nhật"}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ZenBrandTemplate;
