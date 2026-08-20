import React, { useState } from "react";
import Image from "next/image";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";
import { FaTimes, FaCamera } from "react-icons/fa";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const SushiGallery: React.FC<Props> = ({ coreInfo }) => {
    const gallery = [coreInfo.imageMain, ...(coreInfo.images || [])].filter(Boolean);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (gallery.length === 0) return null;

    return (
        <div className="bg-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-[#333] shadow-lg">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-serif text-white inline-flex items-center gap-3">
                    <FaCamera className="text-[#D32F2F]" /> 
                    Không Gian & Tinh Hoa
                </h2>
                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {gallery.map((img, index) => (
                    <div 
                        key={index} 
                        className="relative w-full overflow-hidden rounded-xl cursor-pointer group break-inside-avoid border-2 border-[#333] shadow-md hover:border-[#D32F2F] hover:shadow-[0_0_20px_rgba(211,47,47,0.3)] transition-all duration-300"
                        onClick={() => setSelectedImage(img)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={img} 
                            alt={`Gallery ${index}`} 
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-110"
                            loading="lazy"
                        />
                        {/* Overlay with slight red tint on hover */}
                        <div className="absolute inset-0 bg-[#000]/20 group-hover:bg-[#D32F2F]/10 transition-all duration-300"></div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[120] bg-[#0F0F0F]/95 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-[#A0A0A0] hover:text-[#D32F2F] transition-colors p-3 bg-[#1A1A1A] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-[#333]"
                        onClick={() => setSelectedImage(null)}
                    >
                        <FaTimes size={24} />
                    </button>
                    <div className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.1)]" onClick={e => e.stopPropagation()}>
                        <Image 
                            src={selectedImage} 
                            alt="Phóng to" 
                            fill 
                            className="object-contain bg-[#121212]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SushiGallery;
