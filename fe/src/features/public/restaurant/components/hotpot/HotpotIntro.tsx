import React from "react";
import Image from "next/image";
import { FaPepperHot, FaStar, FaLeaf } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface Props {
    coreInfo: IPublicRestaurantCore;
}

export default function HotpotIntro({ coreInfo }: Props) {
    const validImages = (coreInfo.images || []).filter(img => img && img.trim() !== "");

    return (
        <div className="bg-transparent rounded-2xl p-0 md:p-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D32F2F 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                {/* Left: Content */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 text-[#D32F2F] font-bold tracking-widest text-sm uppercase mb-3">
                            <span className="w-8 h-[2px] bg-[#D32F2F]"></span>
                            Tinh hoa nước lẩu
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 uppercase">
                            Khởi Nguồn <span className="text-[#D32F2F]">Vị Giác</span>
                        </h2>
                        <p className="text-[#AAAAAA] text-lg leading-relaxed">
                            {coreInfo.description || "Tự hào mang đến những trải nghiệm ẩm thực độc đáo với nước lẩu được ninh hầm từ xương nguyên chất trong nhiều giờ, kết hợp cùng các loại thảo mộc và gia vị bí truyền. Chúng tôi cam kết sử dụng nguyên liệu tươi ngon nhất, đồ nhúng phong phú để mỗi bữa ăn của bạn đều là một bữa tiệc bùng nổ hương vị."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#333333]">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-lg bg-[#2D1414] flex items-center justify-center flex-shrink-0 border border-[#4A1C1C]">
                                <FaPepperHot className="text-[#D32F2F] text-xl" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Đậm đà & Cay Nồng</h4>
                                <p className="text-sm text-[#888888]">Công thức nước dùng độc quyền kích thích vị giác.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-lg bg-[#2D1414] flex items-center justify-center flex-shrink-0 border border-[#4A1C1C]">
                                <FaLeaf className="text-[#4CAF50] text-xl" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Nguyên Liệu Tươi</h4>
                                <p className="text-sm text-[#888888]">Thịt bò Mỹ nhập khẩu và rau củ chuẩn VietGAP.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Irregular Image Grid */}
                <div className="w-full lg:w-1/2 relative h-[500px]">
                    {/* Image 1 (Large, back) */}
                    <div className="absolute top-0 right-0 w-3/4 h-[400px] rounded-xl overflow-hidden border-2 border-[#333333] shadow-2xl z-10 group bg-[#232323] flex items-center justify-center">
                        {validImages[0] ? (
                            <>
                                <Image
                                    src={validImages[0]}
                                    alt="Hotpot Experience"
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </>
                        ) : (
                            <span className="text-[#555555] font-bold text-2xl uppercase tracking-widest">Ảnh 1</span>
                        )}
                    </div>
                    
                    {/* Image 2 (Smaller, front overlapping) */}
                    <div className="absolute bottom-0 left-0 w-3/5 h-[320px] rounded-xl overflow-hidden border-4 border-[#141414] shadow-[0_20px_50px_rgba(211,47,47,0.2)] z-20 group bg-[#1A1A1A] flex items-center justify-center">
                        {validImages[1] ? (
                            <>
                                <Image
                                    src={validImages[1]}
                                    alt="Fresh Ingredients"
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#D32F2F]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                        ) : (
                            <span className="text-[#555555] font-bold text-xl uppercase tracking-widest">Ảnh 2</span>
                        )}
                    </div>

                    {/* Quality Badge */}
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-30 bg-[#D32F2F] text-white p-4 rounded-full shadow-[0_0_20px_rgba(211,47,47,0.5)] border-4 border-[#141414] flex flex-col items-center justify-center w-28 h-28 transform rotate-12 hover:rotate-0 transition-transform">
                        <FaStar className="text-2xl mb-1 text-yellow-400" />
                        <span className="font-black text-lg leading-tight text-center">PREMIUM<br/>QUALITY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
