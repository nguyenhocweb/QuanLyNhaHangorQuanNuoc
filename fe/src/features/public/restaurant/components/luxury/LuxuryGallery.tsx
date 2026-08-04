import React, { useState } from 'react';
import Image from 'next/image';
import { IPublicRestaurantCore } from '@/src/features/public/restaurant/type/restaurant.public.type';
import { FaExpand } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const LuxuryGallery: React.FC<Props> = ({ coreInfo }) => {
    const images = [coreInfo.imageMain, ...(coreInfo.images || [])].filter(Boolean) as string[];
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className="py-16">
            <h2 className="text-3xl font-sans text-white text-center mb-12 tracking-wide">Không gian</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                {images.slice(0, 6).map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`relative group cursor-pointer overflow-hidden ${idx === 0 ? 'md:col-span-2 md:row-span-2 aspect-[16/10]' : 'aspect-square'}`}
                        onClick={() => setSelectedImage(img)}
                    >
                        <Image 
                            src={img} 
                            alt={`Gallery ${idx + 1}`} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <FaExpand className="text-yellow-500 text-2xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full max-w-5xl h-[80vh]">
                        <Image 
                            src={selectedImage} 
                            alt="Phóng to" 
                            fill 
                            className="object-contain" 
                        />
                    </div>
                    <button 
                        className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl font-light"
                        onClick={() => setSelectedImage(null)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default LuxuryGallery;
