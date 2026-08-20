import React from "react";
import Image from "next/image";
import { FaCameraRetro } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

export default function HotpotGallery({ coreInfo }: Props) {
    // Lọc ảnh rỗng và thêm ảnh chính
    const allImages = [coreInfo.imageMain, ...(coreInfo.images || [])];
    const validImages = allImages.filter(img => img && img.trim() !== "");

    if (validImages.length === 0) {
        return (
            <div className="bg-[#1A1A1A] rounded-2xl p-8 md:p-14 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#333333] text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4 uppercase">Không Gian <span className="text-[#D32F2F]">Quán</span></h2>
                <div className="py-16 bg-[#232323] rounded-xl border border-[#333333] border-dashed">
                    <p className="text-[#AAAAAA] font-medium text-lg">Cửa hàng chưa cập nhật hình ảnh không gian.</p>
                </div>
            </div>
        );
    }

    const images = validImages;

    return (
        <div className="bg-[#1A1A1A] rounded-2xl p-6 sm:p-10 md:p-14 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#333333] relative overflow-hidden">
            <div className="relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D1414] text-[#D32F2F] font-bold text-sm border border-[#4A1C1C] mb-4 shadow-[0_0_15px_rgba(211,47,47,0.2)]">
                        <FaCameraRetro className="text-lg" />
                        <span className="uppercase tracking-wider">Không Gian</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase">Góc Nhìn <span className="text-[#D32F2F]">Chân Thực</span></h2>
                </div>

                {/* Grid Masonry-like (CSS Grid with distinct row spans) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px]">
                    {images.slice(0, 7).map((img, index) => {
                        // Tạo layout đặc biệt: 
                        // Ảnh 0: To chiếm 2x2
                        // Ảnh 1, 2, 3, 4: Bình thường 1x1 hoặc dọc 1x2
                        let gridClass = "col-span-1 row-span-1";
                        if (index === 0) gridClass = "col-span-2 row-span-2";
                        else if (index === 3) gridClass = "col-span-2 row-span-1";
                        else if (index === 4) gridClass = "col-span-1 row-span-2";

                        return (
                            <div 
                                key={index} 
                                className={`relative rounded-xl overflow-hidden bg-[#232323] border border-[#333333] group cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(211,47,47,0.3)] transition-all duration-300 ${gridClass}`}
                            >
                                <Image
                                    src={img}
                                    alt={`Gallery Image ${index + 1}`}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-[#D32F2F]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
