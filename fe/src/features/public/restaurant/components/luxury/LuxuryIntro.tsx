import React from 'react';
import { IPublicRestaurantCore } from '@/src/features/public/restaurant/type/restaurant.public.type';
import { FaPhoneAlt, FaEnvelope, FaQuoteLeft } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const LuxuryIntro: React.FC<Props> = ({ coreInfo }) => {
    return (
        <div className="py-16 md:py-24 border-y border-[#222]">
            <div className="max-w-4xl mx-auto px-4 text-center">
                
                <FaQuoteLeft className="text-4xl text-yellow-600/30 mx-auto mb-8" />
                
                <p className="text-base md:text-lg text-zinc-300 font-sans leading-relaxed mb-12 whitespace-pre-line">
                    {coreInfo.description}
                </p>
                
                <div className="w-16 h-[1px] bg-yellow-600 mx-auto mb-12" />

                {/* Contact Info */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                    {coreInfo.phone_contact && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="text-yellow-600 text-lg">
                                <FaPhoneAlt />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Điện thoại</div>
                                <a href={`tel:${coreInfo.phone_contact}`} className="text-sm font-medium text-zinc-300 hover:text-yellow-500 transition-colors">
                                    {coreInfo.phone_contact}
                                </a>
                            </div>
                        </div>
                    )}
                    
                    {coreInfo.email_contact && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="text-yellow-600 text-lg">
                                <FaEnvelope />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Email</div>
                                <a href={`mailto:${coreInfo.email_contact}`} className="text-sm font-medium text-zinc-300 hover:text-yellow-500 transition-colors">
                                    {coreInfo.email_contact}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default LuxuryIntro;
