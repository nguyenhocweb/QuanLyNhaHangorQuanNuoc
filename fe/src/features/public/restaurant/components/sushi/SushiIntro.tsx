import React from "react";
import Image from "next/image";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";
import { GiChopsticks } from "react-icons/gi";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

const SushiIntro: React.FC<Props> = ({ coreInfo }) => {
    return (
        <div className="bg-[#1A1A1A] rounded-2xl p-8 md:p-16 border border-[#333] shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F] rounded-full blur-[100px] -mr-20 -mt-20 opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37] rounded-full blur-[120px] -ml-20 -mb-20 opacity-5"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#242424] border border-[#404040]">
                        <GiChopsticks className="text-[#D32F2F] text-xl" />
                        <span className="text-[#D4AF37] font-serif font-medium text-sm tracking-widest uppercase">Triết Lý Của Chúng Tôi</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-serif text-white leading-snug">
                        Nghệ Thuật <br/><span className="text-[#D32F2F] italic">Omakase</span> Đích Thực
                    </h2>
                    
                    <div className="text-[#A0A0A0] font-sans leading-relaxed text-lg space-y-4">
                        {coreInfo.description ? (
                            <p>{coreInfo.description}</p>
                        ) : (
                            <p>
                                Tôn trọng trọn vẹn hương vị nguyên bản từ đại dương. Tại {coreInfo.name}, chúng tôi không chỉ phục vụ món ăn, mà mang đến một màn trình diễn nghệ thuật ẩm thực Nhật Bản cao cấp. 
                                <br/><br/>
                                Từng lát cá tươi ngon nhất được tuyển chọn khắt khe mỗi ngày, kết hợp cùng kỹ thuật đao công điêu luyện của các nghệ nhân Sushi, tạo nên trải nghiệm vị giác khó quên.
                            </p>
                        )}
                    </div>
                </div>

                {/* Images */}
                <div className="w-full md:w-5/12 flex justify-center relative">
                    <div className="relative w-64 h-80 sm:w-80 sm:h-[28rem] rounded-sm overflow-hidden border border-[#333] shadow-[20px_20px_0_0_#D32F2F]">
                        <Image 
                            src={coreInfo.imageMain || "/placeholder.jpg"} 
                            alt="Giới thiệu" 
                            fill 
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        {/* Overlay to darken image slightly */}
                        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-all duration-700"></div>
                    </div>
                    
                    {/* Small accent image if gallery exists */}
                    {coreInfo.images && coreInfo.images.length > 0 && (
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#1A1A1A] shadow-2xl z-20">
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

export default SushiIntro;
