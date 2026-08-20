import React from "react";
import Image from "next/image";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";
import { FaLeaf } from "react-icons/fa";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const ZenIntro: React.FC<Props> = ({ coreInfo }) => {
    return (
        <div className="bg-[#fffaf0] rounded-[40px] p-8 md:p-12 border border-[#efece5] shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f4f5f0] rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f4f5f0] rounded-full blur-3xl -ml-20 -mb-20 opacity-60"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4f5f0] border border-[#d2d6c9]">
                        <FaLeaf className="text-[#4d7c0f]" />
                        <span className="text-[#5c6655] font-sans font-medium text-sm">Câu chuyện của chúng tôi</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-sans text-[#2c3e2e] leading-snug">
                        Về <span className="text-[#4d7c0f] italic">{coreInfo.name}</span>
                    </h2>
                    
                    <div className="text-[#5c6655] font-sans leading-relaxed text-lg space-y-4">
                        {coreInfo.description ? (
                            <p>{coreInfo.description}</p>
                        ) : (
                            <p>
                                Nơi hội tụ tinh hoa ẩm thực chay, mang đến cho thực khách những trải nghiệm thanh tịnh và bình yên nhất. 
                                Chúng tôi cam kết sử dụng nguồn nguyên liệu xanh, sạch và hữu cơ để bảo vệ sức khỏe và môi trường.
                            </p>
                        )}
                    </div>
                </div>

                {/* Images */}
                <div className="w-full md:w-5/12 flex justify-center relative">
                    <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-t-[140px] rounded-b-[40px] overflow-hidden border-8 border-white shadow-xl rotate-[-2deg]">
                        <Image 
                            src={coreInfo.imageMain || "/placeholder.jpg"} 
                            alt="Giới thiệu" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    {/* Small accent image if gallery exists */}
                    {coreInfo.images && coreInfo.images.length > 0 && (
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg rotate-[5deg] z-20">
                            <Image 
                                src={coreInfo.images[0]} 
                                alt="Món ăn" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ZenIntro;
