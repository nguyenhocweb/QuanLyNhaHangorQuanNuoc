import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaExclamationCircle } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
    variant?: 'default' | 'luxury' | 'hotpot' | 'sushi';
}

const PoliciesTab: React.FC<Props> = ({ coreInfo, variant = 'default' }) => {
    const isLuxury = variant === 'luxury';
    const isHotpot = variant === 'hotpot';
    const isSushi = variant === 'sushi';

    if (!coreInfo.policies || coreInfo.policies.length === 0) {
        return null;
    }

    return (
        <div className={`rounded-2xl shadow-sm border p-6 md:p-8 ${isLuxury ? 'bg-[#111] border-[#333]' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>
                <FaExclamationCircle className={isLuxury ? "text-yellow-600" : isHotpot || isSushi ? "text-[#D32F2F]" : "text-amber-500"} />
                Chính sách nhà hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreInfo.policies.map((p, i) => (
                    <div key={i} className={`p-5 rounded-xl border flex flex-col gap-2 ${
                        isLuxury ? 'bg-[#1a1a1a] border-[#222]' : isHotpot || isSushi ? 'bg-[#232323] border-[#444444]' : 'bg-amber-50/50 border-amber-100'
                    }`}>
                        <h4 className={`text-base font-bold ${isLuxury ? 'text-zinc-300' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>{p.name}</h4>
                        <p className={`text-sm leading-relaxed ${isLuxury ? 'text-zinc-500' : isHotpot || isSushi ? 'text-[#AAAAAA]' : 'text-gray-600'}`}>{p.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PoliciesTab;
