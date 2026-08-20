"use client"
import { Div, H, P, A } from "@/src/core/components/ui"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/core/components/ui/Table"
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useDashboardBrands } from "../dashboard_hook/useDashboardBrands_hook";
import Image from "next/image";
import { FiStar, FiArrowRight } from "react-icons/fi";

type PVariant = "tabel_green" | "tabel_gray" | "tabel_red" | "default" | "glow" | "neon" | "truncate_1line" | "truncate_2line" | "text_black" | "tabel_orange" | "text_green" | "mes" | null | undefined;
type StatusStyle = {
    label: string;
    color: PVariant;
};
const STATUS_CONFIG: Record<string, StatusStyle> = {
    ACTIVE: { label: 'Hoạt động', color: "tabel_green" },
    PENDING: { label: 'Chờ duyệt', color: "tabel_gray" },
    INACTIVE: { label: 'Tạm ngưng', color: "tabel_orange" },
    TERMINATED: { label: "Đã chấm dứt", color: "tabel_red" }
};

const DashboardBrand_component = () => {
    const { data: brandData, isLoading } = useDashboardBrands();

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải danh sách thương hiệu...</div>;
    }

    const brands = brandData || [];

    return (
        <>
            <FadeIn delay={0.5}> 
             <Div variant="bg_white" size="full" vitri="col_none" className="p-6">
                    <div className="flex justify-between items-center w-full mb-6">
                        <H variant="text_black" className="text-xl">Thương hiệu tiêu biểu & Mới nhất</H>
                        <A href="/system/brands" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 group">
                            Xem tất cả <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </A>
                    </div>
                    
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <Table>
                            <TableHeader>
                                <TableRow variant="default" className="bg-slate-50">
                                    <TableHead className="w-[280px]">Thương hiệu</TableHead>
                                    <TableHead className="w-[130px]">Trạng thái</TableHead>
                                    <TableHead>Mã số thuế</TableHead>
                                    <TableHead className="text-right">Ngày tham gia</TableHead>
                                    <TableHead className="text-center">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brands.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">Không có thương hiệu nào</TableCell>
                                    </TableRow>
                                ) : (
                                    brands.map(e => (
                                        <TableRow key={e.id} variant="striped" className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative">
                                                        {e.logo ? (
                                                            <Image src={e.logo} alt={e.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                                                                {e.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col max-w-[200px]">
                                                        <div className="flex items-center gap-2">
                                                            <P line="truncate_1line" variant="text_black" className="text-sm font-semibold">{e.name}</P>
                                                            {e.isFeatured && (
                                                                <span className="text-amber-500 flex-shrink-0" title="Thương hiệu nổi bật">
                                                                    <FiStar fill="currentColor" size={14} />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-500 truncate">ID: {e.id.slice(-6)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><P variant={STATUS_CONFIG[e.isActive]?.color || "default"} className="text-sm rounded-lg w-fit px-2.5 py-1" >{STATUS_CONFIG[e.isActive]?.label || e.isActive}</P></TableCell>
                                            <TableCell className="text-slate-600 font-medium">{e.taxCode || "N/A"}</TableCell>
                                            <TableCell className="text-right text-slate-500">{new Date(e.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                            <TableCell className="text-right">
                                                <Div gap="g3_4" className="justify-center">
                                                    <A
                                                        href={`/system/dashboard/brands/${e.id}`}
                                                        variant="green"
                                                        sizea="p2_1"
                                                        className="shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
                                                    >
                                                        Quản lý
                                                    </A>
                                                </Div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Div>
            </FadeIn>
        </>
    )
}
export default DashboardBrand_component;