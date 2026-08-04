import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaCheckCircle, FaStar } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const AmenitiesTab: React.FC<Props> = ({ coreInfo }) => {
    if (!coreInfo.amenities || coreInfo.amenities.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaStar className="text-indigo-600" />
                Tiện ích nổi bật
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coreInfo.amenities.map(amenity => (
                    <div key={amenity.id} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-all text-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 shadow-sm">
                            <FaCheckCircle size={24} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{amenity.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmenitiesTab;
