import React from 'react';
import { IPublicRestaurantCore } from '@/src/features/public/restaurant/type/restaurant.public.type';
import { usePerformanceMode } from '@/src/core/hooks/usePerformanceMode';

import { FaStar, FaMapMarkerAlt, FaMotorcycle } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

export default function ImmersiveHero({ coreInfo }: Props) {
    const { is3D } = usePerformanceMode();

    return (
        <div className="relative w-full min-h-[70vh] flex flex-col justify-end overflow-hidden group rounded-b-3xl">
            {/* Background */}
            <div className="absolute inset-0 w-full h-full">
                {is3D ? (
                    <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-[10s] group-hover:scale-110"
                        style={{ backgroundImage: `url(${coreInfo.imageMain})` }}
                    />
                ) : (
                    <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${coreInfo.imageMain})` }}
                    />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12 pt-32">
                <div className={`transition-all duration-700 ${is3D ? 'translate-y-0 opacity-100' : ''}`}>
                    {/* Brand Badge */}
                    {coreInfo.brand && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6">
                            {coreInfo.brand.logo && <img src={coreInfo.brand.logo} alt="Brand" className="w-5 h-5 rounded-full object-cover" />}
                            <span>Thuộc thương hiệu <strong>{coreInfo.brand.name}</strong></span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        {coreInfo.name}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-200 mb-8">
                        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                            <FaStar className="text-yellow-400" />
                            <span className="font-semibold text-white">{coreInfo.averageRating}</span>
                            <span className="text-gray-400 text-sm">({coreInfo.totalRating} đánh giá)</span>
                        </div>

                        {coreInfo.address?.province && (
                            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                                <FaMapMarkerAlt className="text-rose-400" />
                                <span>{coreInfo.address.province}</span>
                            </div>
                        )}
                    </div>

                    {/* Tags & Delivery */}
                    <div className="flex flex-wrap items-center gap-3">
                        {coreInfo.tags?.map(tag => (
                            <span 
                                key={tag.id}
                                className="px-3 py-1 text-sm rounded-full backdrop-blur-md shadow-sm border"
                                style={{
                                    backgroundColor: tag.bgColor ? `${tag.bgColor}80` : 'rgba(255,255,255,0.1)',
                                    color: tag.textColor || '#fff',
                                    borderColor: tag.bgColor || 'rgba(255,255,255,0.2)'
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                        
                        {coreInfo.delivery_partners?.map((partner, idx) => (
                            <a 
                                key={idx}
                                href={partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 text-sm bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-full border border-white/20 text-white"
                            >
                                <FaMotorcycle />
                                {partner.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
