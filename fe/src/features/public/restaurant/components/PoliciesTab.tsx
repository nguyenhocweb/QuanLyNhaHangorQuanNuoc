import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaExclamationCircle } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const PoliciesTab: React.FC<Props> = ({ coreInfo }) => {
    if (!coreInfo.policies || coreInfo.policies.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaExclamationCircle className="text-amber-500" />
                Chính sách nhà hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreInfo.policies.map((p, i) => (
                    <div key={i} className="p-5 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col gap-2">
                        <h4 className="text-base font-bold text-gray-800">{p.name}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PoliciesTab;
