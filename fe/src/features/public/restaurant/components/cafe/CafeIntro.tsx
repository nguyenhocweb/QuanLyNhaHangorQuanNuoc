import React from "react";
import Image from "next/image";
import { FaCoffee, FaLeaf, FaHeart } from "react-icons/fa";
import { IPublicRestaurantCore } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface CafeIntroProps {
    coreInfo: IPublicRestaurantCore;
}

export default function CafeIntro({ coreInfo }: CafeIntroProps) {
    // Lọc các ảnh rỗng hoặc không hợp lệ
    const validImages = (coreInfo.images || []).filter(img => img && img.trim() !== "");

    return (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#F0EAE1]">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF5F0] text-[#8B5A2B] font-medium text-sm">
                        <FaCoffee />
                        <span>Câu chuyện của chúng tôi</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-[#3B3131] font-serif leading-tight">
                        Hương vị nguyên bản, không gian truyền cảm hứng
                    </h2>

                    <p className="text-lg text-[#6E5C53] leading-relaxed">
                        Chào mừng bạn đến với {coreInfo.name}. Chúng tôi không chỉ phục vụ những ly nước ngon, 
                        mà còn mang đến một không gian ấm áp, nơi bạn có thể thư giãn, làm việc hoặc trò chuyện cùng bạn bè.
                    </p>

                    <p className="text-[#6E5C53] leading-relaxed">
                        Mỗi thức uống tại đây đều được chăm chút tỉ mỉ từ khâu chọn lựa nguyên liệu đến khi pha chế, 
                        nhằm giữ trọn vẹn hương vị tự nhiên và mang lại trải nghiệm tuyệt vời nhất cho bạn.
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#F0EAE1]">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#FAF5F0] text-[#8B5A2B] flex items-center justify-center flex-shrink-0 text-xl">
                                <FaLeaf />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#3B3131]">Nguyên liệu sạch</h4>
                                <p className="text-sm text-[#6E5C53] mt-1">Lựa chọn kỹ lưỡng từ những vùng nguyên liệu tốt nhất.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#FAF5F0] text-[#8B5A2B] flex items-center justify-center flex-shrink-0 text-xl">
                                <FaHeart />
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#3B3131]">Pha chế bằng cả trái tim</h4>
                                <p className="text-sm text-[#6E5C53] mt-1">Mỗi ly nước là một tác phẩm nghệ thuật của các Barista.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
                    <div className="space-y-4 pt-8">
                        <div className="relative h-48 rounded-2xl overflow-hidden shadow-md bg-[#FAF5F0] flex items-center justify-center border border-[#EFE6DD]">
                            {validImages[0] ? (
                                <Image
                                    src={validImages[0]}
                                    alt="Story image 1"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#A99D95] font-medium text-sm">Ảnh 1</span>
                            )}
                        </div>
                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-md bg-[#FAF5F0] flex items-center justify-center border border-[#EFE6DD]">
                            {validImages[1] ? (
                                <Image
                                    src={validImages[1]}
                                    alt="Story image 2"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#A99D95] font-medium text-sm">Ảnh 2</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-md bg-[#FAF5F0] flex items-center justify-center border border-[#EFE6DD]">
                            {validImages[2] ? (
                                <Image
                                    src={validImages[2]}
                                    alt="Story image 3"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#A99D95] font-medium text-sm">Ảnh 3</span>
                            )}
                        </div>
                        <div className="relative h-48 rounded-2xl overflow-hidden shadow-md bg-[#FAF5F0] flex items-center justify-center border border-[#EFE6DD]">
                            {validImages[3] ? (
                                <Image
                                    src={validImages[3]}
                                    alt="Story image 4"
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <span className="text-[#A99D95] font-medium text-sm">Ảnh 4</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
