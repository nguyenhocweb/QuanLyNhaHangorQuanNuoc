import React from "react";
import Image from "next/image";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Props {
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

const LuxuryHero: React.FC<Props> = ({ coreInfo }) => {
    return (
        <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src={coreInfo.imageMain || "/placeholder.jpg"} 
                    alt={coreInfo.name} 
                    fill 
                    className="object-cover scale-105"
                    priority
                />
            </div>

            {/* Dark/Gold Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center max-w-4xl mx-auto px-4 mt-20">
                <FadeIn delay={0.2}>
                    <p className="text-yellow-600 uppercase tracking-[0.3em] text-sm font-medium mb-6">
                        Trải nghiệm Ẩm thực Đỉnh cao
                    </p>
                </FadeIn>
                
                <FadeIn delay={0.4}>
                    <h1 className="text-5xl md:text-7xl font-sans text-white mb-8 leading-tight">
                        {coreInfo.name}
                    </h1>
                </FadeIn>

                <FadeIn delay={0.6}>
                    <div className="flex items-center justify-center gap-3 text-zinc-300 text-sm tracking-wider">
                        <FaMapMarkerAlt className="text-yellow-600" />
                        <span>{coreInfo.address?.street}, {coreInfo.address?.district}</span>
                    </div>
                </FadeIn>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60">
                <span className="text-xs uppercase tracking-widest text-yellow-600">Khám phá</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-600 to-transparent" />
            </div>
        </div>
    );
};

export default LuxuryHero;
