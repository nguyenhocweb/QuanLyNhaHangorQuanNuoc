import React from 'react';
import Image from 'next/image';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaImages } from 'react-icons/fa';

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const GalleryTab: React.FC<Props> = ({ coreInfo }) => {
    // Gộp ảnh bìa (imageMain) và mảng ảnh phụ (images) lại thành 1 mảng duy nhất, loại bỏ giá trị rỗng.
    const allImages = [coreInfo.imageMain, ...(coreInfo.images || [])].filter(Boolean);

    if (allImages.length === 0) {
        return (
            <div className="py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-700">Chưa có hình ảnh không gian</h3>
                <p className="text-gray-500 mt-2">Nhà hàng chưa cập nhật hình ảnh không gian thực tế.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaImages className="text-indigo-600" />
                Không gian nhà hàng
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allImages.map((img, idx) => (
                    <div key={idx} className="relative w-full aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-100 bg-gray-50">
                        <Image 
                            src={img as string} 
                            alt={`Gallery image ${idx + 1}`} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryTab;
