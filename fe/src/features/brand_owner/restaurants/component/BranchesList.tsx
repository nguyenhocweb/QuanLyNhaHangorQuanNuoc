
"use client"
import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Div, H, P, Button } from "@/src/core/components/ui";
import { FiPlus, FiMapPin, FiMail, FiPhone, FiStar, FiEdit2, FiTag, FiAlertCircle, FiUsers, FiCreditCard, FiCheck } from "react-icons/fi";
import { useGetRestaurants } from "../hook/useGetRestaurants";
import { useUpdateRestaurant } from "../hook/useUpdateRestaurant";
import CreateBranchForm from "./CreateBranchForm";
import UpdateBranchForm from "./UpdateBranchForm";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useRouter } from "next/navigation";
import AutoItemCarousel from "@/src/core/components/animation/AutoItemCarousel";

const ColorfulTag = ({ name, type }: { name: string, type: 'category' | 'tag' }) => {
    const colorSeed = name.length + name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);

    const colors = [
        "bg-blue-50 text-blue-600 border-blue-100",
        "bg-emerald-50 text-emerald-600 border-emerald-100",
        "bg-violet-50 text-violet-600 border-violet-100",
        "bg-rose-50 text-rose-600 border-rose-100",
        "bg-amber-50 text-amber-600 border-amber-100",
        "bg-cyan-50 text-cyan-600 border-cyan-100"
    ];

    const selectedColor = colors[colorSeed % colors.length];

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${selectedColor} flex items-center gap-1`}>
            {type === 'tag' && <FiTag className="text-[10px]" />}
            {name}
        </span>
    );
};

// Hàm helper để render UI của Badge trạng thái
const renderStatusBadge = (statusByAdmin: string, statusByBrand: string) => {
    // Nếu Admin chưa duyệt hoặc đã cấm/đóng
    if (statusByAdmin === 'PENDING') {
        return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-amber-200 bg-amber-500/90 text-white flex items-center gap-1"><FiAlertCircle />CHỜ DUYỆT (ADMIN)</span>;
    }
    if (statusByAdmin === 'INACTIVE') {
        return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-orange-200 bg-orange-500/90 text-white flex items-center gap-1"><FiAlertCircle />BỊ KHÓA (ADMIN)</span>;
    }
    if (statusByAdmin === 'TERMINATED') {
        return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-red-200 bg-red-600/90 text-white flex items-center gap-1"><FiAlertCircle />CHẤM DỨT (ADMIN)</span>;
    }

    // Nếu Admin OK, kiểm tra trạng thái của Brand
    switch (statusByBrand) {
        case 'ACTIVE':
            return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-white/10 bg-green-500/90 text-white">ĐANG HOẠT ĐỘNG</span>;
        case 'INACTIVE':
            return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-white/10 bg-gray-600/90 text-white">TẠM DỪNG</span>;
        case 'PENDING':
            return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-white/10 bg-blue-500/90 text-white">ĐANG CHUẨN BỊ</span>;
        case 'TERMINATED':
            return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-white/10 bg-red-600/90 text-white">ĐÃ ĐÓNG CỬA</span>;
        default:
            return <span className="px-3 py-1.5 text-xs font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-white/10 bg-gray-500/90 text-white">KHÔNG XÁC ĐỊNH</span>;
    }
};

const BranchesList = () => {
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const id_brand = user?.brand?.find((b: any) => b?.isSelect || b?.isSlect)?.id || user?.brand?.find((b: any) => b?.id)?.id || "";

    const { data: branches, isLoading } = useGetRestaurants(id_brand);
    const { mutateAsync: updateBranch } = useUpdateRestaurant();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [updateBranchState, setUpdateBranchState] = useState<{isOpen: boolean, branch: any | null}>({ isOpen: false, branch: null });

    if (isLoading) {
        return (
            <Div className="p-10 justify-center items-center w-full min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </Div>
        );
    }

    const toggleStatus = async (e: React.MouseEvent, id: string, currentStatus: string) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha
        // Chỉ cho phép toggle giữa ACTIVE và INACTIVE
        if (currentStatus === "TERMINATED") return;

        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await updateBranch({ id_brand, id, payload: { statusByBrand: newStatus } });
    };

    const handleCardClick = (id: string) => {
        router.push(`/brand_owner/restaurants/${id}`);
    };

    return (
        <Div vitri="col_none" className="w-full" gap="g5_6">
            {/* Header Section */}
            <Div className="justify-between items-center w-full bg-white p-6 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-50">
                <Div vitri="col_none" gap="g1_2">
                    <H variant="text_black" className="text-3xl font-extrabold tracking-tight">Danh sách Chi nhánh</H>
                    <P className="text-gray-500 text-sm font-medium">Quản lý toàn bộ hệ thống nhà hàng của thương hiệu</P>
                </Div>
                <Button
                    variant="green"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-green-500/25 shadow-lg hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => setIsCreateOpen(true)}
                >
                    <FiPlus className="text-xl" />
                    Thêm chi nhánh
                </Button>
            </Div>

            {/* List Section */}
            <Div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full pb-10">
                {branches && branches.length > 0 ? branches.map((branch, index) => (
                    <FadeIn key={branch.id} delay={index * 0.1}>
                        <Div
                            vitri="col_none"
                            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 w-full group relative flex flex-col h-full cursor-pointer"
                            onClick={() => handleCardClick(branch.id)}
                        >

                            {/* Banner Image */}
                            <div className="h-56 w-full relative bg-gray-100 overflow-hidden shrink-0">
                                <img
                                    src={branch.imageMain || "https://res.cloudinary.com/demo/image/upload/v1612847525/sample.jpg"}
                                    alt={branch.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                {/* Badges */}
                                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                                    {renderStatusBadge(branch.statusByAdmin, branch.statusByBrand)}
                                    {branch.isNew && (
                                        <span className="px-3 py-1 text-[11px] font-black tracking-widest rounded-full shadow-lg backdrop-blur-md border border-rose-200 bg-rose-500 text-white animate-pulse">
                                            MỚI
                                        </span>
                                    )}
                                </div>

                                {/* Categories Overlay */}
                                {branch.categories && branch.categories.length > 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 z-10">
                                        {(() => {
                                            const allCategories = branch.categories.map((cat: any) => (
                                                <ColorfulTag key={`cat-${cat.id}`} name={cat.name} type="category" />
                                            ));
                                            return <AutoItemCarousel items={allCategories} height="28px" interval={15} />;
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Content Body */}
                            <Div vitri="col_none" className="px-6 pb-6 pt-4 w-full flex-grow relative" gap="g3_4">

                                {/* Logo Avatar (Overlapping) */}
                                <div className="absolute -top-12 left-6 z-20">
                                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg border border-gray-100">
                                        <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-50">
                                            {branch.logo ? (
                                                <img src={branch.logo} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-100">
                                                    {branch.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Title & Rating Spacer */}
                                <Div className="justify-between items-start w-full mt-8">
                                    <H className="text-xl font-bold text-gray-900 leading-tight pr-2 line-clamp-2 flex-grow">{branch.name}</H>

                                    {/* Ratings with tooltip */}
                                    <div className="relative group/rating shrink-0 mt-1">
                                        <Div className="items-center bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-100 cursor-help transition-colors">
                                            <FiStar className="fill-orange-400 text-orange-400 text-sm mr-1.5" />
                                            <span className="text-sm font-bold text-orange-700">{branch.averageRating?.toFixed(1) || "0.0"}</span>
                                            <span className="text-orange-400/80 text-xs ml-1 font-medium">({branch.totalRating || 0})</span>
                                        </Div>

                                        {/* Tooltip Detailed Rating */}
                                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl opacity-0 group-hover/rating:opacity-100 invisible group-hover/rating:visible transition-all duration-300 z-20">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-gray-300">Đồ ăn:</span>
                                                <span className="font-bold text-orange-400">{branch.average_food_rating?.toFixed(1) || "0.0"} <FiStar className="inline pb-0.5 text-[10px]" /></span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-gray-300">Phục vụ:</span>
                                                <span className="font-bold text-orange-400">{branch.average_service_rating?.toFixed(1) || "0.0"} <FiStar className="inline pb-0.5 text-[10px]" /></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Không gian:</span>
                                                <span className="font-bold text-orange-400">{branch.average_ambiance_rating?.toFixed(1) || "0.0"} <FiStar className="inline pb-0.5 text-[10px]" /></span>
                                            </div>
                                        </div>
                                    </div>
                                </Div>


                                {/* Quick Stats (Capacity & Deposit) */}
                                <Div className="grid grid-cols-2 gap-3 w-full bg-blue-50/40 p-3 rounded-xl border border-blue-50 mt-1">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-blue-600/80 mb-0.5">
                                            <FiUsers className="text-[11px]" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">Sức chứa</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-blue-900">{branch.maxPartySize ? `${branch.maxPartySize} khách` : "Chưa có"}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-blue-600/80 mb-0.5">
                                            <FiCreditCard className="text-[11px]" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/80">Yêu cầu cọc</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-blue-900">
                                            {branch.depositRequired
                                                ? (branch.depositPerPax ? `${branch.depositPerPax.toLocaleString()}đ` : "Có yêu cầu")
                                                : "Không yêu cầu"}
                                        </span>
                                    </div>
                                </Div>

                                {/* Contact Info */}
                                <Div vitri="col_none" gap="g3_4" className="w-full mt-2 flex-grow">
                                    {branch.address && (
                                        <Div className="items-start gap-3 w-full group/item">
                                            <Div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover/item:bg-blue-50 group-hover/item:text-blue-500 transition-colors">
                                                <FiMapPin className="text-[15px]" />
                                            </Div>
                                            <P className="text-[13.5px] text-gray-600 leading-relaxed font-medium pt-1 line-clamp-2">
                                                {[branch.address.street, branch.address.ward, branch.address.district, branch.address.city || (branch.address as any).province].filter(Boolean).join(", ")}
                                            </P>
                                        </Div>
                                    )}

                                    <Div className="grid grid-cols-2 gap-4 w-full">
                                        {branch.phoneContact && (
                                            <Div className="items-center gap-2.5 w-full group/item">
                                                <Div className="w-7 h-7 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover/item:bg-green-50 group-hover/item:text-green-500 transition-colors">
                                                    <FiPhone className="text-[13px]" />
                                                </Div>
                                                <P className="text-[13px] font-medium text-gray-600 truncate">{branch.phoneContact}</P>
                                            </Div>
                                        )}
                                        {branch.emailContact && (
                                            <Div className="items-center gap-2.5 w-full group/item">
                                                <Div className="w-7 h-7 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover/item:bg-purple-50 group-hover/item:text-purple-500 transition-colors">
                                                    <FiMail className="text-[13px]" />
                                                </Div>
                                                <P className="text-[13px] font-medium text-gray-600 truncate">{branch.emailContact}</P>
                                            </Div>
                                        )}
                                    </Div>
                                </Div>

                                {/* Actions */}
                                <Div className="pt-5 mt-auto border-t border-gray-100 flex justify-between items-center w-full">
                                    <button
                                        onClick={(e) => toggleStatus(e, branch.id, branch.statusByBrand)}
                                        disabled={branch.statusByBrand === 'TERMINATED' || branch.statusByAdmin !== 'ACTIVE'}
                                        className={`text-[13px] font-bold px-4 py-2 rounded-xl transition-all border ${branch.statusByBrand === 'TERMINATED' || branch.statusByAdmin !== 'ACTIVE'
                                            ? 'text-gray-400 border-gray-100 bg-gray-50 cursor-not-allowed'
                                            : branch.statusByBrand === 'ACTIVE'
                                                ? 'text-red-500 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200'
                                                : 'text-green-600 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-200'
                                            }`}
                                    >
                                        {branch.statusByBrand === 'ACTIVE' ? 'Tạm ngưng hoạt động' : 'Mở lại hoạt động'}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUpdateBranchState({ isOpen: true, branch });
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 rounded-xl transition-all"
                                    >
                                        <FiEdit2 className="text-[14px] mb-0.5" />
                                        Cập nhật
                                    </button>
                                </Div>
                            </Div>
                        </Div>
                    </FadeIn>
                )) : (
                    <Div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <FiMapPin className="text-4xl text-gray-300" />
                        </div>
                        <H className="text-xl text-gray-800 font-bold mb-2">Chưa có chi nhánh nào</H>
                        <P className="text-gray-500 text-sm max-w-sm text-center">Hệ thống của bạn chưa có chi nhánh nào hoạt động. Hãy thêm chi nhánh đầu tiên để bắt đầu quản lý.</P>
                        <Button
                            variant="green"
                            className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <FiPlus className="text-lg" />
                            Thêm chi nhánh ngay
                        </Button>
                    </Div>
                )}
            </Div>

            <CreateBranchForm isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} id_brand={id_brand} />

            {updateBranchState.branch && (
                <UpdateBranchForm
                    isOpen={updateBranchState.isOpen}
                    onClose={() => setUpdateBranchState({ isOpen: false, branch: null })}
                    id_brand={id_brand}
                    branch={updateBranchState.branch}
                />
            )}
        </Div>
    );
};

export default BranchesList;
