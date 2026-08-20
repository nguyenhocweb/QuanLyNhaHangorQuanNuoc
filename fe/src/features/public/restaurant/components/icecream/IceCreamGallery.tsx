import React from "react";
import Image from "next/image";
import { FaCameraRetro } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface IceCreamGalleryProps {
    coreInfo: IPublicRestaurantCore;
}

export default function IceCreamGallery({ coreInfo }: IceCreamGalleryProps) {
    // Lọc các ảnh rỗng và gom cả ảnh bìa
    const allImages = [coreInfo.imageMain, ...(coreInfo.images || [])];
    const validImages = allImages.filter(img => img && img.trim() !== "");

    if (validImages.length === 0) {
        return (
            <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-sm border-[3px] border-[#FFF0F3] text-center">
                <h2 className="text-4xl font-extrabold text-[#FF8BA7] font-sans mb-4">Khoảnh Khắc Ngọt Ngào</h2>
                <div className="py-16 bg-[#FFF8F0] rounded-3xl border-2 border-[#FFE3E9] border-dashed">
                    <p className="text-[#8D6E63] font-medium text-lg">Cửa hàng chưa cập nhật hình ảnh không gian.</p>
                </div>
            </div>
        );
    }

    const images = validImages;

    return (
        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-sm border-[3px] border-[#FFF0F3] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-[#E2F0CB] opacity-30"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-4 border-[#FFE3E9] opacity-30"></div>

            <div className="relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF0F3] text-[#FF8BA7] font-bold text-sm border border-[#FFE3E9] mb-4 shadow-sm">
                        <FaCameraRetro className="text-lg" />
                        <span className="uppercase tracking-wider">Không Gian</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#5D4037] font-sans drop-shadow-sm">Khoảnh Khắc Ngọt Ngào</h2>
                </div>

                {/* Polaroid Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {images.slice(0, 6).map((img, index) => {
                        // Tạo hiệu ứng xoay nghiêng nhẹ ngẫu nhiên cho phong cách Polaroid
                        const rotation = index % 2 === 0 ? "transform -rotate-2 hover:rotate-1" : "transform rotate-2 hover:-rotate-1";
                        const bgColor = index % 3 === 0 ? "bg-[#FFF0F3]" : (index % 3 === 1 ? "bg-[#E2F0CB]" : "bg-[#B5EAD7]");

                        return (
                            <div 
                                key={index} 
                                className={`relative p-3 pb-10 bg-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] border border-[#FFE3E9] transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(255,139,167,0.2)] hover:z-20 cursor-pointer ${rotation}`}
                            >
                                {/* Băng keo giả (tape) */}
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 opacity-60 mix-blend-multiply ${bgColor} transform -rotate-3 z-10`}></div>
                                
                                <div className="relative h-48 sm:h-56 w-full rounded-lg overflow-hidden bg-[#FFF8F0]">
                                    <Image
                                        src={img}
                                        alt={`Gallery Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-3 w-full text-center left-0">
                                    <span className="font-medium text-[#FF8BA7] text-sm">#SweetChill</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
