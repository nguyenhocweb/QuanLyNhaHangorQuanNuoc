"use client"
import { Div, P, H, Button } from "@/src/core/components/ui"
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiLock, FiStar, FiCopy, FiCheck } from "react-icons/fi"
import { MdStore } from "react-icons/md"
import { useState, useRef, useEffect } from "react"
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useRestaurant } from "../hook/useRestaurant_hook";
import { useUpdateRestaurant } from "../hook/useUpdateRestaurant_hook";

import { useCategoryRestaurant } from "../../categories/hook/useCategoryRestaurant_hook";
import { cities } from "@/src/core/lib/configAddressCity";
import UpdateRestaurant from "./UpdateRestaurant_Form";
import CreateRestaurant from "./CreateRestaurantForm";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import UpdateRestaurantStatusModal from "./UpdateRestaurantStatus_Modal";

const RestaurantComponent = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [city, setCity] = useState("");
    const [rating, setRating] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
    const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState<boolean>(false);
    const [restaurantToUpdateStatus, setRestaurantToUpdateStatus] = useState<any>(null);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [citySearch, setCitySearch] = useState("");
    const cityRef = useRef<HTMLDivElement>(null);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleCopyText = (text: string | undefined | null, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
                setIsCityOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: restaurantData, isLoading } = useRestaurant({ page, limit, search, status, city, rating, categoryId });
    const { data: categoryData } = useCategoryRestaurant({ page: 1, limit: 100, search: "", status: "true" });
    const categories = categoryData?.data || [];
    const restaurants = restaurantData?.data || [];
    const meta = restaurantData?.meta;

    const { mutate: updateRestaurant, isPending: isUpdating } = useUpdateRestaurant();



    const renderStatusBadge = (status: string | undefined) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-green-50 text-green-600 border border-green-100 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Hoạt động</span>;
            case 'INACTIVE':
                return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-yellow-50 text-yellow-600 border border-yellow-100 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Tạm nghỉ</span>;
            case 'TERMINATED':
                return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-red-50 text-red-600 border border-red-100 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Nghỉ vĩnh viễn</span>;
            case 'PENDING':
            default:
                return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Chờ duyệt</span>;
        }
    };

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (value: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setSearch(value);
            setPage(1);
        }, 500);
    };

    const paginationItems = () => {
        if (!meta) return [];
        const { totalPages, currentPage } = meta;
        let pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) pages = [1, 2, 3, 4, '...', totalPages];
            else if (currentPage >= totalPages - 2) pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            else pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
        return pages;
    };

    return (
        <FadeIn delay={0.1}>
            <Div vitri="col_none" size="full" className="gap-8">
                {/* HEADER & STATS */}
                <Div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <MdStore className="text-2xl" />
                        </div>
                        <div>
                            <H variant="text_black" className="text-xl md:text-2xl font-bold text-gray-900">Quản lý Nhà hàng</H>
                            <P className="text-gray-500 text-[14px] mt-1">Theo dõi và quản lý danh sách nhà hàng</P>
                        </div>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} variant="default" shape="square" sizea="p4_2" className="flex items-center whitespace-nowrap gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-all">
                        <FiPlus className="text-lg" /> Thêm nhà hàng mới
                    </Button>
                </Div>

                {/* STATS */}
                <Div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
                    <FadeIn delay={0.1}>
                        <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-indigo-500 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl"><MdStore /></div>
                                <div className="flex flex-col">
                                    <P className="text-[13.5px] text-gray-500 font-medium mb-1">Tổng nhà hàng</P>
                                    <H variant="text_black" className="text-3xl font-bold text-gray-900">{meta?.totalRecords || 0}</H>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.15}>
                        <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-blue-400 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl"><FiStar /></div>
                                <div className="flex flex-col">
                                    <P className="text-[13.5px] text-gray-500 font-medium mb-1">Nhà hàng mới</P>
                                    <H variant="text_black" className="text-3xl font-bold text-blue-600">{meta?.totalNew || 0}</H>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-green-500 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl"><FiCheckCircle /></div>
                                <div className="flex flex-col">
                                    <P className="text-[13.5px] text-gray-500 font-medium mb-1">Đang hoạt động</P>
                                    <H variant="text_black" className="text-3xl font-bold text-green-600">{meta?.totalActive || 0}</H>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-red-400 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl"><FiLock /></div>
                                <div className="flex flex-col">
                                    <P className="text-[13.5px] text-gray-500 font-medium mb-1">Đã khóa</P>
                                    <H variant="text_black" className="text-3xl font-bold text-gray-900">{meta?.totalInactive || 0}</H>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </Div>

                {/* DATA TABLE */}
                <Div className="w-full bg-white rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
                    {/* FILTERS */}
                    <div className="p-6 border-b border-gray-100 flex flex-col gap-4 bg-gray-50/30 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                            <div className="relative w-full sm:w-80 group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <FiSearch />
                                </div>
                                <input
                                    type="text"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-[14px] bg-white placeholder-gray-400 shadow-sm"
                                    placeholder="Tìm kiếm tên nhà hàng..."
                                />
                            </div>
                            <div className="flex items-center bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-inner">
                                <button onClick={() => setStatus("all")} className={`flex-1 sm:flex-none px-5 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap ${status === "all" ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}>Tất cả</button>
                                <button onClick={() => setStatus("true")} className={`flex-1 sm:flex-none px-5 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap ${status === "true" ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-green-600 hover:bg-gray-200/50'}`}>Hoạt động</button>
                                <button onClick={() => setStatus("false")} className={`flex-1 sm:flex-none px-5 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap ${status === "false" ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-red-500 hover:bg-gray-200/50'}`}>Khóa</button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="relative w-full sm:w-48" ref={cityRef}>
                                <div 
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all text-[13px] text-gray-600 bg-white shadow-sm flex items-center cursor-text"
                                    onClick={() => setIsCityOpen(true)}
                                >
                                    <input 
                                        type="text"
                                        className="w-full outline-none bg-transparent py-0.5"
                                        placeholder="Chọn Tỉnh/Thành phố..."
                                        value={isCityOpen ? citySearch : (cities.find(c => c.value === city)?.label || "")}
                                        onChange={(e) => {
                                            setCitySearch(e.target.value);
                                            setIsCityOpen(true);
                                        }}
                                        onFocus={() => {
                                            setIsCityOpen(true);
                                            setCitySearch("");
                                        }}
                                    />
                                </div>
                                {isCityOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {cities.filter(c => c.label.toLowerCase().includes(citySearch.toLowerCase())).map((c) => (
                                            <div 
                                                key={c.value}
                                                className="px-4 py-2 text-[13px] text-gray-600 hover:bg-indigo-50 cursor-pointer transition-colors"
                                                onClick={() => {
                                                    setCity(c.value);
                                                    setPage(1);
                                                    setCitySearch("");
                                                    setIsCityOpen(false);
                                                }}
                                            >
                                                {c.label}
                                            </div>
                                        ))}
                                        {cities.filter(c => c.label.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                                            <div className="px-4 py-2 text-[13px] text-gray-400">Không tìm thấy</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <select 
                                value={categoryId}
                                onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                                className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-[13px] text-gray-600 bg-white shadow-sm"
                            >
                                <option value="">Tất cả loại nhà hàng</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            <select 
                                value={rating}
                                onChange={(e) => { setRating(e.target.value); setPage(1); }}
                                className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-[13px] text-gray-600 bg-white shadow-sm"
                            >
                                <option value="">Mọi đánh giá</option>
                                <option value="4.5">Từ 4.5★ trở lên</option>
                                <option value="4.0">Từ 4.0★ trở lên</option>
                                <option value="3.5">Từ 3.5★ trở lên</option>
                                <option value="3.0">Từ 3.0★ trở lên</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[1000px] text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[12px] uppercase tracking-wider">
                                    <th className="py-4 px-5 font-semibold w-[5%] min-w-[60px]">STT</th>
                                    <th className="py-4 px-5 font-semibold w-[22%] min-w-[180px]">Nhà hàng</th>
                                    <th className="py-4 px-5 font-semibold w-[12%] min-w-[120px]">Thương hiệu</th>
                                    <th className="py-4 px-5 font-semibold w-[11%] min-w-[130px]">Liên hệ</th>
                                    <th className="py-4 px-5 font-semibold w-[11%] min-w-[130px]">Quản lý</th>
                                    <th className="py-4 px-5 font-semibold w-[12%] min-w-[140px]">Loại nhà hàng</th>
                                    <th className="py-4 px-5 font-semibold w-[15%] min-w-[140px]">Trạng thái</th>
                                    <th className="py-4 px-5 font-semibold w-[10%] min-w-[100px] text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-[14px]">Đang tải dữ liệu...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : restaurants.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-400">
                                            Không tìm thấy nhà hàng nào.
                                        </td>
                                    </tr>
                                ) : restaurants.map((e, index) => (
                                    <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors group">
                                        <td className="py-4 px-5 text-[14px] text-gray-500 font-medium">
                                            #{((page - 1) * limit + index + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-2">
                                                <div className="font-semibold text-[14px] text-gray-900">{e.name}</div>
                                                {(e.totalRating !== undefined && e.totalRating > 0) && (
                                                    <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-0.5">
                                                        {e.averageRating?.toString().replace('.', ',')}
                                                        <span className="text-yellow-500">★</span>
                                                        <span className="text-blue-400">/{e.totalRating}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[12px] text-gray-500 mt-1">
                                                {(() => {
                                                    const addr = e.address as any;
                                                    if (typeof addr === 'object' && addr) {
                                                        return [addr.street, addr.ward, addr.district, addr.province || e.city].filter(Boolean).join(', ');
                                                    }
                                                    const addrStr = typeof addr === 'string' ? addr : '';
                                                    return `${addrStr}${e.city && !addrStr.includes(e.city) ? `, ${e.city}` : ''}`;
                                                })()}
                                            </div>
                                            <div className="text-[11px] text-gray-400 mt-0.5">
                                                Tham gia: {new Date(e.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-[13px] text-gray-700 font-medium">
                                            {e.brand?.name ? (
                                                <div className="flex items-center gap-1 group/brand">
                                                    <span className="truncate max-w-[130px]" title={e.brand?.name}>{e.brand?.name}</span>
                                                    <button 
                                                        onClick={(ev) => handleCopyText(e.brand?.name || '', ev)}
                                                        className="opacity-0 group-hover/brand:opacity-100 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 transition-all"
                                                        title="Copy brand name"
                                                    >
                                                        {copiedText === e.brand?.name ? <FiCheck className="text-green-500" /> : <FiCopy />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic font-normal text-[12px]">Độc lập</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-5 text-[13px] text-gray-600">
                                            {e.emailContact && (
                                                <div className="flex items-center gap-1 group/email">
                                                    <div className="text-gray-900 truncate max-w-[130px]" title={e.emailContact}>{e.emailContact}</div>
                                                    <button 
                                                        onClick={(ev) => handleCopyText(e.emailContact, ev)}
                                                        className="opacity-0 group-hover/email:opacity-100 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 transition-all"
                                                        title="Copy email"
                                                    >
                                                        {copiedText === e.emailContact ? <FiCheck className="text-green-500" /> : <FiCopy />}
                                                    </button>
                                                </div>
                                            )}
                                            {e.phoneContact && <div className="text-gray-500 mt-0.5">{e.phoneContact}</div>}
                                            {!e.emailContact && !e.phoneContact && <span className="text-gray-400 italic">Chưa cập nhật</span>}
                                        </td>
                                        <td className="py-4 px-5">
                                            {e.employments && e.employments.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    {e.employments[0].user.avatar ? (
                                                        <img src={e.employments[0].user.avatar} alt={e.employments[0].user.name} className="w-6 h-6 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                            {e.employments[0].user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-[13px] font-medium text-gray-700">{e.employments[0].user.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-[12px]">Chưa chỉ định</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-5">
                                            {e.categories && e.categories.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {e.categories.map((cat, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium whitespace-nowrap border"
                                                            style={{
                                                                backgroundColor: cat.bgColor || '#EEF2FF',
                                                                color: cat.textColor || '#6366F1',
                                                                borderColor: cat.textColor ? `${cat.textColor}30` : '#6366F130'
                                                            }}
                                                        >
                                                            {cat.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-[12px]">Chưa có</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-500 font-medium w-[42px]">Admin:</span>
                                                    {renderStatusBadge(e.statusByAdmin)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-500 font-medium w-[42px]">Brand:</span>
                                                    {renderStatusBadge(e.statusByBrand)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline"
                                                    sizea="p2_1"
                                                    className="text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-lg p-2 h-8 w-8 flex items-center justify-center transition-all"
                                                    onClick={() => {
                                                        setRestaurantToUpdateStatus(e);
                                                        setIsUpdateStatusModalOpen(true);
                                                    }}
                                                    title="Cập nhật trạng thái"
                                                >
                                                    <FiCheckCircle />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    sizea="p2_1"
                                                    className="text-gray-500 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg p-2 h-8 w-8 flex items-center justify-center transition-all"
                                                    onClick={() => {
                                                        setSelectedRestaurantId(e.id);
                                                        setIsUpdateModal(true);
                                                    }}
                                                >
                                                    <FiEdit2 />
                                                </Button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {meta && (
                        <div className="w-full p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-b-2xl">
                            <div className="text-[13px] text-gray-600">
                                Tổng cộng <span className="font-semibold text-gray-900">{meta.totalRecords}</span> nhà hàng
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                    <span>Hiển thị</span>
                                    <select
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 font-medium"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span>/ trang</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[13px] font-medium"
                                    >
                                        Trước
                                    </button>

                                    {paginationItems().map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => typeof p === 'number' && setPage(p)}
                                            disabled={p === '...'}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] transition-colors ${p === page
                                                    ? 'bg-indigo-500 text-white font-semibold shadow-sm'
                                                    : p === '...'
                                                        ? 'text-gray-400 cursor-default'
                                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                        disabled={page >= meta.totalPages || meta.totalPages === 0}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[13px] font-medium"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Div>
            </Div>
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <CreateRestaurant onclickClose={() => setIsCreateModalOpen(false)} />
                </div>
            )}
            {isUpdateModal && selectedRestaurantId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <UpdateRestaurant
                        restaurantId={selectedRestaurantId}
                        onclickClose={() => {
                            setIsUpdateModal(false);
                            setSelectedRestaurantId(null);
                        }}
                    />
                </div>
            )}

            <UpdateRestaurantStatusModal
                isOpen={isUpdateStatusModalOpen}
                onClose={() => {
                    setIsUpdateStatusModalOpen(false);
                    setRestaurantToUpdateStatus(null);
                }}
                restaurant={restaurantToUpdateStatus}
            />
        </FadeIn>
    )
}
export default RestaurantComponent
