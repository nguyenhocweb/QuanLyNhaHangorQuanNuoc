import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileContract, FaCheckCircle, FaStar } from "react-icons/fa";
import BrandDetailEcosystem from "../BrandDetailEcosystem";

interface StandardTemplateProps {
    data: any;
    idBrand: string;
}

const StandardTemplate = ({ data, idBrand }: StandardTemplateProps) => {
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
        <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-20 animate-fade-in">
            {/* Standard Hero Banner */}
            <div className="w-full relative md:px-6 lg:px-8 md:pt-6">
                <div className="w-full h-[40vh] md:h-[50vh] max-w-7xl mx-auto relative bg-slate-900 md:rounded-3xl overflow-hidden shadow-lg">
                    <Image
                        src={coverImage}
                        alt={data.name || "Brand Cover"}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-6 md:pb-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-5 translate-y-6 md:translate-y-8 translate-x-2 md:translate-x-6">
                    {/* Logo */}
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl bg-white shadow-lg border-4 border-white flex items-center justify-center overflow-hidden flex-shrink-0 z-10">
                        {isUrlLogo ? (
                            <Image src={data.logo} alt="Logo" fill className="object-cover" />
                        ) : (
                            <span className="text-2xl font-black text-slate-800 tracking-wider">
                                {logoText}
                            </span>
                        )}
                    </div>
                    
                    {/* Title */}
                    <div className="flex-1 pb-3 z-10">
                        <div className="flex items-center gap-2 mb-2">
                            {data.isFeatured && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] md:text-xs">
                                    <FaStar /> Nổi bật
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] md:text-xs">
                                <FaCheckCircle /> {data.isActive === "ACTIVE" ? "Đã xác thực" : "Hoạt động"}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                            {data.name}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sidebar - Contact & Info */}
                <div className="col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-100 text-slate-800">Thông tin liên hệ</h2>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3 text-slate-600">
                                    <FaMapMarkerAlt className="text-slate-400 mt-1 text-lg" />
                                    <div>
                                        <span className="block font-medium text-slate-900 mb-0.5">Trụ sở chính</span>
                                        {getAddressString()}
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <FaPhoneAlt className="text-slate-400 mt-1 text-lg" />
                                    <div>
                                        <span className="block font-medium text-slate-900 mb-0.5">Hotline</span>
                                        <a href={`tel:${data.phone_contact}`} className="hover:text-blue-600 font-semibold">{data.phone_contact || "Đang cập nhật"}</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <FaEnvelope className="text-slate-400 mt-1 text-lg" />
                                    <div>
                                        <span className="block font-medium text-slate-900 mb-0.5">Email</span>
                                        <a href={`mailto:${data.email_contact}`} className="hover:text-blue-600 font-semibold">{data.email_contact || "Đang cập nhật"}</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <FaGlobe className="text-slate-400 mt-1 text-lg" />
                                    <div>
                                        <span className="block font-medium text-slate-900 mb-0.5">Website</span>
                                        <a href={data.link || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-semibold truncate block max-w-[200px]">{data.link || "Đang cập nhật"}</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600">
                                    <FaFileContract className="text-slate-400 mt-1 text-lg" />
                                    <div>
                                        <span className="block font-medium text-slate-900 mb-0.5">Mã số thuế</span>
                                        {data.tax_code || "Đang cập nhật"}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Main Column - Description & Ecosystem */}
                <div className="col-span-1 lg:col-span-2 space-y-8">
                    {/* Description */}
                    {data.description && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-slate-800">Giới thiệu chung</h2>
                            <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
                                {data.description}
                            </div>
                        </div>
                    )}
                    
                    {/* Ecosystem (Dishes & Restaurants) */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <BrandDetailEcosystem idBrand={idBrand} brandName={data?.name} grid={2} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StandardTemplate;
