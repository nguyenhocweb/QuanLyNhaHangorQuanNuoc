import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileContract, FaCheckCircle, FaStar } from "react-icons/fa";
import BrandDetailEcosystem from "../BrandDetailEcosystem";

interface LuxuryTemplateProps {
    data: any;
    idBrand: string;
}

const LuxuryTemplate = ({ data, idBrand }: LuxuryTemplateProps) => {
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
        <div className="w-full min-h-screen bg-black text-white selection:bg-amber-600/30 animate-fade-in">
            {/* Luxury Hero */}
            <div className="relative w-full h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <Image
                    src={coverImage}
                    alt={data.name || "Brand Cover"}
                    fill
                    className="object-cover opacity-40 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-0"></div>
                
                <div className="z-10 animate-fade-in-up mt-16 max-w-4xl w-full flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-500/50 bg-black/50 backdrop-blur-sm flex items-center justify-center overflow-hidden mb-8 p-1">
                        <div className="w-full h-full rounded-full border border-amber-500/20 flex items-center justify-center overflow-hidden">
                            {isUrlLogo ? (
                                <Image src={data.logo} alt="Logo" fill className="object-cover p-2" />
                            ) : (
                                <span className="text-xl font-black text-amber-500 tracking-wider">
                                    {logoText}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-amber-500 uppercase tracking-[0.3em] text-xs sm:text-sm font-medium mb-4">
                        Trải nghiệm Tinh hoa
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 tracking-wider">
                        {data?.name || "Tên Thương Hiệu"}
                    </h1>
                    <div className="w-24 h-[1px] bg-amber-600/50 mx-auto mb-8"></div>
                    <p className="text-gray-300 max-w-2xl text-lg sm:text-xl font-light italic px-4">
                        {data?.subscriptions?.[0]?.plan?.name || "Sự hoàn hảo trong từng chi tiết."}
                    </p>
                </div>
            </div>

            {/* Luxury Content */}
            <div className="max-w-6xl mx-auto px-6 py-24 space-y-32">
                
                {/* Introduction Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="order-2 md:order-1">
                        <div className="flex items-center gap-4 mb-6 text-amber-500/70">
                            <span className="w-12 h-[1px] bg-amber-500/50"></span>
                            <span className="uppercase tracking-widest text-sm">Câu Chuyện</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-light mb-8 leading-tight">Khởi Nguồn Của <br/>Sự Tinh Tế</h2>
                        <div className="text-gray-400 leading-relaxed font-light text-lg space-y-6">
                            <p>{data?.description || "Thương hiệu được sinh ra từ niềm đam mê với nghệ thuật ẩm thực. Chúng tôi chú trọng vào những chi tiết nhỏ nhất để mang lại cảm xúc trọn vẹn."}</p>
                            {data?.isFeatured && (
                                <p className="text-amber-500/80 italic">"Được vinh danh là thương hiệu tiêu biểu của năm."</p>
                            )}
                        </div>
                    </div>
                    <div className="aspect-[4/5] relative order-1 md:order-2">
                        <Image src={data.images?.[1] || coverImage} alt="Story" fill className="object-cover opacity-80" />
                        <div className="absolute inset-4 border border-amber-500/30"></div>
                    </div>
                </section>

                {/* Info / Contact Section */}
                <section className="bg-zinc-950 border border-white/10 p-12 lg:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-900/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-2xl font-light mb-10 text-amber-500 tracking-widest uppercase text-sm">Thông tin Liên Hệ</h2>
                            <ul className="space-y-8">
                                <li>
                                    <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Trụ Sở Phục Vụ</span>
                                    <span className="text-lg font-light text-gray-200">{getAddressString()}</span>
                                </li>
                                <li>
                                    <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Đặt Bàn / Hotline</span>
                                    <a href={`tel:${data?.phoneContact}`} className="text-lg font-light text-gray-200 hover:text-amber-500 transition-colors">{data?.phoneContact || "Liên hệ qua Website"}</a>
                                </li>
                                <li>
                                    <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Hòm Thư Kín</span>
                                    <a href={`mailto:${data?.emailContact}`} className="text-lg font-light text-gray-200 hover:text-amber-500 transition-colors">{data?.emailContact || "Liên hệ qua Website"}</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-light mb-10 text-amber-500 tracking-widest uppercase text-sm">Hiện Diện Trực Tuyến</h2>
                            <ul className="space-y-8">
                                <li>
                                    <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Website Chính Thức</span>
                                    <a href={data?.link || "#"} target="_blank" rel="noopener noreferrer" className="text-lg font-light text-gray-200 hover:text-amber-500 transition-colors truncate block">{data?.link || "Chưa cập nhật"}</a>
                                </li>
                                <li>
                                    <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Tư Cách Pháp Nhân</span>
                                    <span className="text-lg font-light text-gray-200">{data?.taxCode ? `MST: ${data.taxCode}` : "Đã xác thực minh bạch"}</span>
                                </li>
                                <li>
                                    <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Tình Trạng</span>
                                    <span className="text-lg font-light flex items-center gap-2 text-gray-200">
                                        <FaCheckCircle className="text-amber-500 text-sm" /> 
                                        {data.isActive === "ACTIVE" ? "Đang hoạt động" : "Hoạt động"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Ecosystem Section */}
                <section>
                    {/* Using the standard component but wrapping it in dark mode aware container */}
                    <div className="dark">
                        <BrandDetailEcosystem idBrand={idBrand} brandName={data?.name} />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default LuxuryTemplate;
