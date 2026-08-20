import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
    layout?: 'horizontal' | 'vertical';
    isCard?: boolean;
    variant?: 'default' | 'luxury' | 'hotpot' | 'sushi';
}

const LocationTab: React.FC<Props> = ({ coreInfo, layout = 'horizontal', isCard = true, variant = 'default' }) => {
    const { street, ward, district, province } = coreInfo.address || {};
    const fullAddress = [street, ward, district, province].filter(Boolean).join(', ');
    const isLuxury = variant === 'luxury';
    const isHotpot = variant === 'hotpot';
    const isSushi = variant === 'sushi';

    if (!fullAddress) {
        return null;
    }

    // Embed Google Maps using the address string. Note: In production, using a Google Maps API Key or actual coordinates is better.
    const encodedAddress = encodeURIComponent(fullAddress + ' Vietnam');
    const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className={isCard ? `rounded-2xl shadow-sm border p-6 md:p-8 ${isLuxury ? 'bg-[#111] border-[#333]' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white border-gray-100'}` : ""}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>
                <FaMapMarkerAlt className={isLuxury ? "text-yellow-600" : isHotpot || isSushi ? "text-[#D32F2F]" : "text-rose-500"} />
                Vị trí & Bản đồ
            </h2>
            
            <div className={`flex gap-6 ${layout === 'vertical' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                <div className={`rounded-xl overflow-hidden border h-[300px] relative shadow-inner ${layout === 'vertical' ? 'w-full' : 'flex-1 md:h-[400px]'} ${isLuxury ? 'bg-[#1a1a1a] border-[#222]' : isHotpot || isSushi ? 'bg-[#232323] border-[#444444]' : 'bg-gray-100 border-gray-200'}`}>
                    <iframe 
                        src={mapSrc}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location"
                    ></iframe>
                </div>
                <div className={`flex flex-col justify-center space-y-4 ${layout === 'vertical' ? 'w-full' : 'w-full md:w-80'}`}>
                    <h3 className={`font-bold text-lg ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>{coreInfo.name}</h3>
                    <div className={`flex items-start gap-3 ${isLuxury ? 'text-zinc-400' : isHotpot || isSushi ? 'text-[#AAAAAA]' : 'text-gray-600'}`}>
                        <FaMapMarkerAlt className={`${isLuxury ? 'text-yellow-600' : isHotpot || isSushi ? 'text-[#D32F2F]' : 'text-rose-500'} mt-1 flex-shrink-0`} />
                        <span className="leading-relaxed text-sm">{fullAddress}</span>
                    </div>
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 font-bold rounded-xl transition-colors shadow-md ${
                            isLuxury ? 'bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30' : isHotpot || isSushi ? 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]' : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    >
                        <FaDirections size={18} />
                        Chỉ đường tới đây
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LocationTab;
