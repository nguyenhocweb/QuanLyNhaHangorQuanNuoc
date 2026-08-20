import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaBookOpen, FaUsers, FaCalendarCheck, FaClock, FaMoneyBillWave, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const IntroTab: React.FC<Props> = ({ coreInfo }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaBookOpen className="text-indigo-600" />
                Giới thiệu
            </h2>

            {/* Contact Info Section */}
            <div className="mb-8 pb-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
                <div className="flex flex-col md:flex-row gap-6">
                    {coreInfo.phoneContact && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-600">
                                <FaPhoneAlt />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Điện thoại</div>
                                <a href={`tel:${coreInfo.phoneContact}`} className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors">{coreInfo.phoneContact}</a>
                            </div>
                        </div>
                    )}
                    
                    {coreInfo.emailContact && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-600">
                                <FaEnvelope />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Email</div>
                                <a href={`mailto:${coreInfo.emailContact}`} className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors">{coreInfo.emailContact}</a>
                            </div>
                        </div>
                    )}

                    {coreInfo.social_links && coreInfo.social_links.length > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-600">
                                <FaGlobe />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Liên kết mạng xã hội</div>
                                <div className="flex items-center gap-3 mt-0.5">
                                    {coreInfo.social_links.map((social, idx) => (
                                        <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors capitalize">
                                            {social.platform}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Basic Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                        <FaUsers size={20} />
                    </div>
                    <span className="text-xs text-gray-500 mb-1 font-medium">Sức chứa tối đa (nhóm)</span>
                    <span className="font-bold text-gray-900">{coreInfo.maxPartySize} người</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                        <FaCalendarCheck size={20} />
                    </div>
                    <span className="text-xs text-gray-500 mb-1 font-medium">Đặt trước tối đa</span>
                    <span className="font-bold text-gray-900">{coreInfo.bookingWindowDays} ngày</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                        <FaClock size={20} />
                    </div>
                    <span className="text-xs text-gray-500 mb-1 font-medium">Hủy miễn phí trước</span>
                    <span className="font-bold text-gray-900">{coreInfo.cancellationHours} giờ</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center hover:border-indigo-200 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                        <FaMoneyBillWave size={20} />
                    </div>
                    <span className="text-xs text-gray-500 mb-1 font-medium">Yêu cầu cọc tiền</span>
                    <span className="font-bold text-gray-900">{coreInfo.depositRequired ? "Có" : "Không"}</span>
                </div>
            </div>

            {/* Description Section */}
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-lg pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Về nhà hàng</h3>
                {coreInfo.description || "Nhà hàng chưa cập nhật bài giới thiệu."}
            </div>
        </div>
    );
};

export default IntroTab;
