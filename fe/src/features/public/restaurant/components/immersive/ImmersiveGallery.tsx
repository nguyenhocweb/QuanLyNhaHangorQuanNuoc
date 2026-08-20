import React, { useState } from 'react';
import { IPublicRestaurantCore } from '@/src/features/public/restaurant/type/restaurant.public.type';
import { usePerformanceMode } from '@/src/core/hooks/usePerformanceMode';

import { FaImage, FaTimes } from 'react-icons/fa';
import ImmersiveCard from './ImmersiveCard';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

export default function ImmersiveGallery({ coreInfo }: Props) {
    const { is3D } = usePerformanceMode();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const images = coreInfo.images || [];

    if (images.length === 0) {
        return null;
    }

    return (
        <ImmersiveCard className="!mt-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaImage className="text-pink-500" /> Thư viện ảnh
            </h2>
            
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {images.map((img, idx) => {
                    const content = (
                        <div 
                            className="w-full relative group cursor-pointer overflow-hidden rounded-xl"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img 
                                src={img} 
                                alt={`Gallery ${idx}`} 
                                className={`w-full h-auto object-cover transition-transform duration-500 ${is3D ? 'group-hover:scale-110' : ''}`}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-medium">Xem lớn</span>
                            </div>
                        </div>
                    );

                    if (is3D) {
                        return (
                            <div key={idx} className="break-inside-avoid">
                                {content}
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className="break-inside-avoid">
                            {content}
                        </div>
                    );
                })}
            </div>

            {/* Modal Image Viewer */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-sm">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-50"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                    <img 
                        src={selectedImage} 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300"
                        alt="Zoomed"
                    />
                </div>
            )}
        </ImmersiveCard>
    );
}
