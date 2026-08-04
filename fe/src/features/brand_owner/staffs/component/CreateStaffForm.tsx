"use client"
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiSave, FiUserPlus, FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiShield, FiSearch, FiCheck, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { createStaffSchema, CreateStaffFormValues } from "../schema/staff.create.schema";
import { useCreateStaff } from "../hook/useCreateStaff";
import { useGetBrandOwnerPermissions } from "../../job_roles/hook/useGetBrandOwnerPermissions";
import { useGetRestaurants } from "../../restaurants/hook/useGetRestaurants";
import { useSearchUser } from "../hook/useSearchUser";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    id_brand: string;
    initialRestaurantId?: string;
}

const CreateStaffForm: React.FC<Props> = ({ isOpen, onClose, id_brand, initialRestaurantId }) => {
    const { mutateAsync: createStaff, isPending } = useCreateStaff(id_brand);
    
    // Lấy danh sách chi nhánh
    const { data: restaurants } = useGetRestaurants(id_brand);
    // Lấy danh sách quyền hạn
    const { data: permissionsObj } = useGetBrandOwnerPermissions(id_brand);
    
    const brandPermissions = permissionsObj?.metadata?.BRAND || [];
    const restaurantPermissions = permissionsObj?.metadata?.RESTAURANT || [];

    const [step, setStep] = useState<1 | 2>(1);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: searchResults, isLoading: isSearching, refetch } = useSearchUser(id_brand, searchTerm);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, trigger } = useForm<CreateStaffFormValues>({
        resolver: zodResolver(createStaffSchema) as any,
        defaultValues: {
            userId: "",
            name: "",
            email: "",
            password: "",
            phone: "",
            restaurantId: "",
            isManager: false,
            permissionIds: []
        }
    });

    useEffect(() => {
        if (isOpen && initialRestaurantId) {
            setValue("restaurantId", initialRestaurantId);
        }
    }, [isOpen, initialRestaurantId, setValue]);

    const watchedRestaurantId = watch("restaurantId");
    const isManager = watch("isManager");

    if (!isOpen) return null;

    const handleSearch = () => {
        if (searchKeyword.trim().length > 0) {
            setSearchTerm(searchKeyword);
        }
    };

    const handleSelectExistingUser = (user: any) => {
        setValue("userId", user.id);
        setValue("name", user.name);
        setValue("email", user.email);
        setStep(2);
    };

    const handleNextToStep2 = async () => {
        // Validation for Step 1 when creating new
        const isValid = await trigger(["name", "email", "password", "phone"]);
        if (isValid) {
            setValue("userId", ""); // Xóa userId nếu đang tạo mới
            setStep(2);
        }
    };

    const togglePermission = (id: string) => {
        const current = watch("permissionIds") || [];
        if (current.includes(id)) {
            setValue("permissionIds", current.filter(p => p !== id), { shouldValidate: true });
        } else {
            setValue("permissionIds", [...current, id], { shouldValidate: true });
        }
    };

    const onSubmit = async (data: CreateStaffFormValues) => {
        if (!id_brand) return;
        
        // Chuẩn hoá payload
        const payload = {
            ...data,
            restaurantId: data.restaurantId === "" ? undefined : data.restaurantId
        };

        try {
            await createStaff(payload);
            reset();
            setStep(1);
            setIsCreatingNew(false);
            setSearchKeyword("");
            setSearchTerm("");
            onClose();
        } catch (error) {
            // Lỗi đã được Toast bên trong hook xử lý
        }
    };

    return (
        <FadeIn className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl flex flex-col relative ring-1 ring-white/50 max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-6 flex justify-between items-center shrink-0 rounded-t-[24px]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/50 flex items-center justify-center shadow-sm">
                            <FiUserPlus className="text-2xl text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Thêm nhân viên mới</h2>
                            <p className="text-gray-500 text-sm mt-0.5 font-medium">Tạo tài khoản và phân quyền cho nhân viên</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200 bg-gray-50 text-gray-500 hover:text-gray-800 hover:rotate-90"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <form id="staffForm" onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 bg-[#FAFAFA] flex-1 overflow-y-auto custom-scrollbar">

                    {step === 1 && (
                        <FadeIn delay={0.1} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                                <h3 className="text-lg font-bold text-gray-800 tracking-wide">Nhân viên</h3>
                            </div>

                            {/* Nút chuyển đổi Search / Tạo mới */}
                            <div className="flex gap-4 mb-6">
                                <Button 
                                    type="button" 
                                    onClick={() => setIsCreatingNew(false)} 
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isCreatingNew ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                >
                                    Tìm kiếm tài khoản có sẵn
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={() => setIsCreatingNew(true)} 
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isCreatingNew ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                >
                                    Tạo mới tài khoản
                                </Button>
                            </div>

                            {!isCreatingNew ? (
                                <div className="space-y-6">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                            <input 
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium"
                                                placeholder="Tìm theo email, số điện thoại, hoặc tên..."
                                            />
                                        </div>
                                        <Button type="button" onClick={handleSearch} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold">Tìm</Button>
                                    </div>

                                    {/* Kết quả tìm kiếm */}
                                    <div className="min-h-[150px] border border-dashed border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                                        {isSearching ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                                                <FiLoader className="animate-spin text-2xl" />
                                                <p>Đang tìm kiếm...</p>
                                            </div>
                                        ) : searchResults && searchResults.length > 0 ? (
                                            searchResults.map((user) => (
                                                <div key={user.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-indigo-700 text-lg">
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-base">{user.name}</p>
                                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                                                <span className="flex items-center gap-1"><FiMail /> {user.email}</span>
                                                                {user.sdt && <span className="flex items-center gap-1"><FiPhone /> {user.sdt}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        type="button" 
                                                        onClick={() => handleSelectExistingUser(user)}
                                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
                                                    >
                                                        Chọn <FiArrowRight />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : searchTerm ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 text-sm">
                                                <p>Không tìm thấy tài khoản nào phù hợp với "{searchTerm}"</p>
                                                <Button type="button" onClick={() => setIsCreatingNew(true)} className="mt-3 text-indigo-600 hover:underline">Tạo tài khoản mới?</Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-gray-300 text-sm italic">
                                                <p>Nhập từ khóa và bấm Tìm kiếm</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="group col-span-full md:col-span-1">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <FiUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" /> Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("name")}
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                            placeholder="VD: Nguyễn Văn A"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.name.message as string}</p>}
                                    </div>

                                    <div className="group col-span-full md:col-span-1">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <FiMail className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" /> Email đăng nhập <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("email")}
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.email.message as string}</p>}
                                    </div>

                                    <div className="group col-span-full md:col-span-1">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <FiLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" /> Mật khẩu khởi tạo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            {...register("password")}
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                            placeholder="Tối thiểu 8 ký tự, có Hoa, thường, số..."
                                        />
                                        {errors.password && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.password.message as string}</p>}
                                    </div>

                                    <div className="group col-span-full md:col-span-1">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <FiPhone className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" /> Số điện thoại
                                        </label>
                                        <input
                                            {...register("phone")}
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                            placeholder="VD: 0912345678"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.phone.message as string}</p>}
                                    </div>
                                    
                                    <div className="col-span-full flex justify-end mt-4">
                                        <Button type="button" onClick={handleNextToStep2} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold flex items-center gap-2">
                                            Tiếp tục <FiArrowRight />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </FadeIn>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Thông tin nhân viên được chọn */}
                            <FadeIn delay={0.1} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-indigo-700 shadow-sm border border-indigo-100">
                                        {watch("name")?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Nhân viên: {watch("name")}</p>
                                        <p className="text-xs text-gray-500">{watch("email")}</p>
                                    </div>
                                </div>
                                <Button type="button" onClick={() => setStep(1)} className="text-sm text-indigo-600 hover:bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-all border border-transparent hover:border-indigo-200 flex items-center gap-1">
                                    <FiArrowLeft /> Đổi người
                                </Button>
                            </FadeIn>

                            {/* 2. Work Location */}
                            <FadeIn delay={0.2} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">2</div>
                                    <h3 className="text-lg font-bold text-gray-800 tracking-wide">Nơi làm việc</h3>
                                </div>
                                <div className="group">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                        <FiMapPin className="text-gray-400 group-focus-within:text-orange-500 transition-colors" /> Chi nhánh trực thuộc
                                    </label>
                                    <select 
                                        {...register("restaurantId")}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all duration-300 font-medium text-gray-800 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={!!initialRestaurantId}
                                    >
                                        <option value="">--- Tất cả chi nhánh (Cấp thương hiệu) ---</option>
                                        {restaurants?.map((r: any) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-gray-500 text-xs mt-2 italic">Nếu không chọn, nhân viên sẽ có quyền truy cập ở cấp độ toàn thương hiệu (tùy theo phân quyền bên dưới).</p>
                                </div>
                            </FadeIn>

                            {watchedRestaurantId !== "" && (
                                <FadeIn delay={0.25} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                                    <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isManager ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-transparent hover:bg-gray-100'}`}>
                                        <input 
                                            type="checkbox" 
                                            {...register("isManager")}
                                            className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className={`font-bold ${isManager ? 'text-orange-900' : 'text-gray-800'}`}>Nâng cấp lên Quản lý chi nhánh</span>
                                            <span className="text-sm text-gray-500">Người dùng sẽ có toàn quyền trên chi nhánh này và không cần phải tick chọn từng quyền bên dưới.</span>
                                        </div>
                                    </label>
                                </FadeIn>
                            )}

                            {/* 3. Permissions */}
                            {(!watchedRestaurantId || !isManager) && (
                                <FadeIn delay={0.3} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">3</div>
                                        <h3 className="text-lg font-bold text-gray-800 tracking-wide">Phân quyền chức năng</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-8">
                                        {/* Brand Permissions (Only if no restaurant selected) */}
                                        {!watchedRestaurantId && (
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-100 flex items-center gap-2">
                                                    <FiShield /> Quyền cấp Thương hiệu
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {brandPermissions?.map((p: any) => {
                                                        const isChecked = watch("permissionIds")?.includes(p.id);
                                                        return (
                                                            <label key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50/50 border-transparent hover:bg-gray-100'}`}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isChecked}
                                                                    onChange={() => togglePermission(p.id)}
                                                                    className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 shrink-0"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className={`font-semibold text-sm ${isChecked ? 'text-indigo-900' : 'text-gray-700'}`}>{p.name}</span>
                                                                    <span className="text-xs text-gray-500 mt-0.5">{p.description}</span>
                                                                </div>
                                                            </label>
                                                        )
                                                    })}
                                                    {brandPermissions.length === 0 && <span className="text-sm text-gray-500">Đang tải...</span>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Restaurant Permissions (Only if restaurant is selected and not manager) */}
                                        {watchedRestaurantId && !isManager && (
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-orange-700 mb-4 pb-2 border-b border-orange-100 flex items-center gap-2">
                                                    <FiShield /> Quyền cấp Chi nhánh
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {restaurantPermissions?.map((p: any) => {
                                                        const isChecked = watch("permissionIds")?.includes(p.id);
                                                        return (
                                                            <label key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-transparent hover:bg-gray-100'}`}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isChecked}
                                                                    onChange={() => togglePermission(p.id)}
                                                                    className="mt-1 w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 shrink-0"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className={`font-semibold text-sm ${isChecked ? 'text-orange-900' : 'text-gray-700'}`}>{p.name}</span>
                                                                    <span className="text-xs text-gray-500 mt-0.5">{p.description}</span>
                                                                </div>
                                                            </label>
                                                        )
                                                    })}
                                                    {restaurantPermissions.length === 0 && <span className="text-sm text-gray-500">Đang tải...</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.permissionIds && <p className="text-red-500 text-xs font-medium pl-1 mt-3">{errors.permissionIds.message as string}</p>}
                                </FadeIn>
                            )}
                        </div>
                    )}

                </form>

                {/* Footer */}
                <div className="shrink-0 flex justify-end gap-4 px-8 py-6 bg-white border-t border-gray-100 rounded-b-[24px]">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 hover:-translate-y-0.5"
                        disabled={isPending}
                    >
                        Hủy bỏ
                    </Button>
                    {step === 2 && (
                        <Button
                            type="submit"
                            form="staffForm"
                            disabled={isPending}
                            className="px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {isPending ? <FiLoader className="animate-spin text-xl" /> : <FiSave className="text-xl" />}
                            {isPending ? "Đang xử lý..." : "Lưu nhân viên"}
                        </Button>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
            `}</style>
        </FadeIn>
    );
};

export default CreateStaffForm;
