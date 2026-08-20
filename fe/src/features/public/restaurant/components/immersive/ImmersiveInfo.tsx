import React, { useState } from 'react';
import { IPublicRestaurantCore } from '@/src/features/public/restaurant/type/restaurant.public.type';
import { usePerformanceMode } from '@/src/core/hooks/usePerformanceMode';
import { FaChevronDown, FaCheckCircle, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import ImmersiveCard from './ImmersiveCard';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

export default function ImmersiveInfo({ coreInfo }: Props) {
    const { is3D } = usePerformanceMode();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [openPolicyIndex, setOpenPolicyIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const togglePolicy = (index: number) => {
        setOpenPolicyIndex(openPolicyIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Description */}
            {coreInfo.description && (
                <ImmersiveCard className="!mt-0">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaInfoCircle className="text-indigo-500" /> Về chúng tôi
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                        {coreInfo.description}
                    </p>
                </ImmersiveCard>
            )}

            {/* Amenities - Horizontal Scroll */}
            {coreInfo.amenities && coreInfo.amenities.length > 0 && (
                <ImmersiveCard className="!mt-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Tiện ích
                    </h2>
                    <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide">
                        {coreInfo.amenities.map(amenity => (
                            <div 
                                key={amenity.id}
                                className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                    is3D 
                                    ? "bg-white/10 shadow-md border border-white/20 hover:-translate-y-1 hover:shadow-lg" 
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                                <FaCheckCircle className="text-emerald-500" />
                                <span className="font-medium text-gray-700">{amenity.name}</span>
                            </div>
                        ))}
                    </div>
                </ImmersiveCard>
            )}

            {/* Policies - Accordion */}
            {coreInfo.policies && coreInfo.policies.length > 0 && (
                <ImmersiveCard className="!mt-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Quy định nhà hàng
                    </h2>
                    <div className="flex flex-col gap-3">
                        {coreInfo.policies.map((policy, idx) => (
                            <div 
                                key={idx} 
                                className={`border rounded-xl overflow-hidden transition-all ${
                                    is3D ? "hover:shadow-md bg-white/5 border-white/20" : "bg-gray-50 border-gray-100"
                                }`}
                            >
                                <button
                                    onClick={() => togglePolicy(idx)}
                                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-800 focus:outline-none"
                                >
                                    <span>{policy.name}</span>
                                    <FaChevronDown className={`transition-transform duration-300 text-gray-400 ${openPolicyIndex === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <div 
                                    className={`px-4 text-gray-600 overflow-hidden transition-all duration-300 ${openPolicyIndex === idx ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="whitespace-pre-line text-sm">{policy.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ImmersiveCard>
            )}

            {/* FAQs - Accordion */}
            {coreInfo.faqs && coreInfo.faqs.length > 0 && (
                <ImmersiveCard className="!mt-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-500" /> Câu hỏi thường gặp
                    </h2>
                    <div className="flex flex-col gap-3">
                        {coreInfo.faqs.map((faq, idx) => (
                            <div 
                                key={idx} 
                                className={`border rounded-xl overflow-hidden transition-all ${
                                    is3D ? "hover:shadow-md bg-white/5 border-white/20" : "bg-gray-50 border-gray-100"
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-800 focus:outline-none"
                                >
                                    <span>{faq.question}</span>
                                    <FaChevronDown className={`transition-transform duration-300 text-gray-400 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <div 
                                    className={`px-4 text-gray-600 overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="whitespace-pre-line text-sm">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ImmersiveCard>
            )}
        </div>
    );
}
