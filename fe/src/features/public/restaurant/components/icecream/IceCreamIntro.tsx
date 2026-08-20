import React from "react";
import Image from "next/image";
import { FaIceCream, FaSnowflake, FaHeart } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface IceCreamIntroProps {
    coreInfo: IPublicRestaurantCore;
}

export default function IceCreamIntro({ coreInfo }: IceCreamIntroProps) {
    // Lọc các ảnh rỗng hoặc không hợp lệ
    const validImages = (coreInfo.images || []).filter(img => img && img.trim() !== "");

    return (
        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-sm border-[3px] border-[#FFF0F3] relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#E2F0CB] rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-[#FFE3E9] rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>

            <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF0F3] text-[#FF8BA7] font-bold text-sm border border-[#FFE3E9] shadow-sm">
                        <FaIceCream className="text-lg" />
                        <span className="uppercase tracking-wider">Câu chuyện ngọt ngào</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#FF8BA7] font-sans leading-tight drop-shadow-sm">
                        Mát lạnh, tươi mới & <br/> Đầy màu sắc
                    </h2>

                    <p className="text-lg text-[#8D6E63] leading-relaxed font-medium">
                        Chào mừng bạn đến với {coreInfo.name}. Nơi mang đến những viên kem mát lạnh, xua tan cái nóng và làm bừng sáng ngày của bạn bằng những hương vị ngọt ngào nhất.
                    </p>

                    <p className="text-[#8D6E63] leading-relaxed">
                        Chúng tôi tự hào sử dụng các nguyên liệu tươi ngon nhất, trái cây thật và sữa hảo hạng để tạo ra những mẻ kem sánh mịn, đậm đà mà không quá ngọt. 
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t-2 border-dashed border-[#FFE3E9]">
                        <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-[#FFF8F0] transition-colors border border-transparent hover:border-[#FFE3E9]">
                            <div className="w-14 h-14 rounded-full bg-[#E2F0CB] text-[#7CB342] flex items-center justify-center flex-shrink-0 text-2xl shadow-sm transform hover:scale-110 transition-transform">
                                <FaSnowflake />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#5D4037] text-lg">Mát lạnh tự nhiên</h4>
                                <p className="text-sm text-[#8D6E63] mt-1">Làm mới liên tục mỗi ngày, không chất bảo quản.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-[#FFF8F0] transition-colors border border-transparent hover:border-[#FFE3E9]">
                            <div className="w-14 h-14 rounded-full bg-[#FFE3E9] text-[#FF8BA7] flex items-center justify-center flex-shrink-0 text-2xl shadow-sm transform hover:scale-110 transition-transform">
                                <FaHeart />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#5D4037] text-lg">Làm từ trái tim</h4>
                                <p className="text-sm text-[#8D6E63] mt-1">Mỗi viên kem là sự cân bằng hoàn hảo của hương vị.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Grid with Playful Borders */}
                <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
                    <div className="space-y-4 pt-12">
                        <div className="relative h-56 rounded-[40px] overflow-hidden shadow-sm bg-[#FFF0F3] flex items-center justify-center border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            {validImages[0] ? (
                                <Image
                                    src={validImages[0]}
                                    alt="Ice cream 1"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#FF8BA7] font-bold text-sm">Ảnh 1</span>
                            )}
                        </div>
                        <div className="relative h-64 rounded-[40px] overflow-hidden shadow-sm bg-[#E2F0CB] flex items-center justify-center border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300">
                            {validImages[1] ? (
                                <Image
                                    src={validImages[1]}
                                    alt="Ice cream 2"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#7CB342] font-bold text-sm">Ảnh 2</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="relative h-64 rounded-[40px] overflow-hidden shadow-sm bg-[#FFF8F0] flex items-center justify-center border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            {validImages[2] ? (
                                <Image
                                    src={validImages[2]}
                                    alt="Ice cream 3"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#FFB7B2] font-bold text-sm">Ảnh 3</span>
                            )}
                        </div>
                        <div className="relative h-56 rounded-[40px] overflow-hidden shadow-sm bg-[#B5EAD7] flex items-center justify-center border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                            {validImages[3] ? (
                                <Image
                                    src={validImages[3]}
                                    alt="Ice cream 4"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#4DB6AC] font-bold text-sm">Ảnh 4</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
