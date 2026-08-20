import React, { useState } from "react";
import Image from "next/image";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";
import { FaTimes, FaCamera } from "react-icons/fa";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const ZenGallery: React.FC<Props> = ({ coreInfo }) => {
    const gallery = [coreInfo.imageMain, ...(coreInfo.images || [])].filter(Boolean);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (gallery.length === 0) return null;

    return (
        <div className="bg-[#fffaf0] rounded-[40px] p-8 md:p-12 border border-[#efece5] shadow-sm">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-sans text-[#2c3e2e] inline-flex items-center gap-3">
                    <FaCamera className="text-[#4d7c0f]" /> 
                    Không Gian & Món Ăn
                </h2>
                <div className="w-24 h-1 bg-[#4d7c0f]/30 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {gallery.map((img, index) => (
                    <div 
                        key={index} 
                        className="relative w-full overflow-hidden rounded-[24px] cursor-pointer group break-inside-avoid border-4 border-white shadow-sm"
                        onClick={() => setSelectedImage(img)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={img} 
                            alt={`Gallery ${index}`} 
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[#2c3e2e]/0 group-hover:bg-[#2c3e2e]/20 transition-all duration-300"></div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[120] bg-[#fdfbf7]/90 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-[#2c3e2e] hover:text-[#4d7c0f] transition-colors p-3 bg-white rounded-full shadow-md"
                        onClick={() => setSelectedImage(null)}
                    >
                        <FaTimes size={24} />
                    </button>
                    <div className="relative w-full max-w-5xl h-[80vh] rounded-[32px] overflow-hidden border-8 border-white shadow-2xl" onClick={e => e.stopPropagation()}>
                        <Image 
                            src={selectedImage} 
                            alt="Phóng to" 
                            fill 
                            className="object-contain bg-[#fffaf0]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZenGallery;
