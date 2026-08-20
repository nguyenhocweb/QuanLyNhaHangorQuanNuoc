import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaCheckCircle, FaStar } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
    variant?: 'default' | 'luxury' | 'hotpot' | 'sushi';
}

const AmenitiesTab: React.FC<Props> = ({ coreInfo, variant = 'default' }) => {
    const isLuxury = variant === 'luxury';
    const isHotpot = variant === 'hotpot';
    const isSushi = variant === 'sushi';
    if (!coreInfo.amenities || coreInfo.amenities.length === 0) {
        return null;
    }

    return (
        <div className={`rounded-2xl shadow-sm border p-6 md:p-8 ${isLuxury ? 'bg-[#111] border-[#333]' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>
                <FaStar className={isLuxury ? "text-yellow-600" : isHotpot || isSushi ? "text-[#D32F2F]" : "text-indigo-600"} />
                Tiện ích nổi bật
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coreInfo.amenities.map(amenity => (
                    <div key={amenity.id} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${
                        isLuxury 
                            ? 'bg-[#1a1a1a] border-[#222] hover:border-yellow-900/50' 
                            : isHotpot || isSushi
                                ? 'bg-[#232323] border-[#444444] hover:border-[#D32F2F]/50'
                                : 'bg-gray-50 border-gray-100 hover:border-indigo-200'
                    }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm ${
                            isLuxury 
                                ? 'bg-yellow-900/20 text-yellow-600' 
                                : isHotpot || isSushi
                                    ? 'bg-[#2D1414] text-[#D32F2F]'
                                    : 'bg-indigo-100 text-indigo-600'
                        }`}>
                            <FaCheckCircle size={24} />
                        </div>
                        <span className={`text-sm font-bold ${isLuxury ? 'text-zinc-300' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-700'}`}>
                            {amenity.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmenitiesTab;
