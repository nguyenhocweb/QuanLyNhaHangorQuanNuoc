import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const LocationTab: React.FC<Props> = ({ coreInfo }) => {
    const { street, ward, district, province } = coreInfo.address || {};
    const fullAddress = [street, ward, district, province].filter(Boolean).join(', ');

    if (!fullAddress) {
        return null;
    }

    // Embed Google Maps using the address string. Note: In production, using a Google Maps API Key or actual coordinates is better.
    const encodedAddress = encodeURIComponent(fullAddress + ' Vietnam');
    const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-rose-500" />
                Vị trí & Bản đồ
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 h-[300px] md:h-[400px] bg-gray-100 relative shadow-inner">
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
                <div className="w-full md:w-80 flex flex-col justify-center space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">{coreInfo.name}</h3>
                    <div className="flex items-start gap-3 text-gray-600">
                        <FaMapMarkerAlt className="text-rose-500 mt-1 flex-shrink-0" />
                        <span className="leading-relaxed text-sm">{fullAddress}</span>
                    </div>
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md"
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
