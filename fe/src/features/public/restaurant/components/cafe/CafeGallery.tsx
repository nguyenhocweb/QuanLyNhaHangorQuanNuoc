import React from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface CafeGalleryProps {
    coreInfo: IPublicRestaurantCore;
}

export default function CafeGallery({ coreInfo }: CafeGalleryProps) {
    // Bao gồm cả ảnh chính (imageMain) và các ảnh khác (images)
    const allImages = [coreInfo.imageMain, ...(coreInfo.images || [])];
    const validImages = allImages.filter(img => img && img.trim() !== "");

    if (validImages.length === 0) {
        return (
            <div className="bg-white rounded-[24px] p-6 sm:p-10 shadow-sm border border-[#F0EAE1] text-center">
                <h2 className="text-3xl font-serif text-[#3B3131] mb-2">Không Gian Quán</h2>
                <div className="py-12 bg-[#FAF5F0] rounded-2xl border border-[#EFE6DD] border-dashed">
                    <p className="text-[#6E5C53] font-sans">Quán chưa cập nhật hình ảnh không gian.</p>
                </div>
            </div>
        );
    }

    const images = validImages;

    return (
        <div className="bg-white rounded-[24px] p-6 sm:p-10 shadow-sm border border-[#F0EAE1]">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-[#3B3131] inline-flex items-center gap-3">
                        Không Gian Quán
                    </h2>
                    <p className="text-[#6E5C53] mt-2 font-sans">
                        Góc nhỏ thư giãn và check-in lý tưởng.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[#8B5A2B] bg-[#FAF5F0] px-4 py-2 rounded-full border border-[#EFE6DD]">
                    <FaCamera />
                    <span className="text-sm font-medium">{images.length} hình ảnh</span>
                </div>
            </div>

            {/* Masonry-like Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                {images.slice(0, 5).map((img, index) => {
                    // Make the first image span 2 rows and 2 columns on larger screens
                    const isFeatured = index === 0;
                    
                    return (
                        <div 
                            key={index} 
                            className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-[#EFE6DD]
                                ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
                            `}
                        >
                            <Image
                                src={img}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                    <FaCamera />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {images.length > 5 && (
                <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-[#FAF5F0] hover:bg-[#EFE6DD] text-[#8B5A2B] font-medium rounded-full transition-colors border border-[#DCCCBD]">
                        Xem tất cả hình ảnh
                    </button>
                </div>
            )}
        </div>
    );
}
