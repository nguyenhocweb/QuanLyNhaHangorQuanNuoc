import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FiMapPin, FiLayers, FiUsers, FiCreditCard, FiFileText, FiEdit3 } from "react-icons/fi";
import { Button } from "@/src/core/components/ui";
import UpdateBranchForm from "../UpdateBranchForm";

interface BranchOverviewTabProps {
    branch: any;
    id_brand: string;
}

const BranchOverviewTab: React.FC<BranchOverviewTabProps> = ({ branch, id_brand }) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    return (
        <FadeIn className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiMapPin className="text-blue-500" /> Liên hệ & Địa chỉ
                    </h3>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-semibold mb-1">Địa chỉ cụ thể</span>
                            <span className="text-sm font-medium text-gray-700">
                                {[branch.address?.street, branch.address?.ward, branch.address?.district, branch.address?.city || (branch.address as any)?.province].filter(Boolean).join(", ")}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-semibold mb-1">Số điện thoại</span>
                            <span className="text-sm font-medium text-gray-700">{branch.phoneContact || "Chưa cập nhật"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-semibold mb-1">Email</span>
                            <span className="text-sm font-medium text-gray-700">{branch.emailContact || "Chưa cập nhật"}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 shadow-sm">
                    <h3 className="text-base font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <FiLayers className="text-blue-500" /> Cấu hình vận hành
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-50">
                            <div className="flex items-center gap-2 text-blue-800">
                                <FiUsers className="text-blue-500" /> Sức chứa
                            </div>
                            <span className="font-bold text-blue-900">{branch.maxPartySize} khách</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-50">
                            <div className="flex items-center gap-2 text-blue-800">
                                <FiCreditCard className="text-blue-500" /> Tiền cọc
                            </div>
                            <span className="font-bold text-blue-900">{branch.depositRequired ? `${branch.depositPerPax?.toLocaleString()} VNĐ` : "Không yêu cầu"}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50 shadow-sm mt-6">
                    <h3 className="text-base font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" className="text-amber-500"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        Cấu hình Thuế & Phí
                    </h3>
                    <div className="space-y-4">
                        <div className="flex flex-col bg-white p-3 rounded-xl border border-amber-50">
                            <span className="text-xs text-gray-400 font-semibold mb-1">VAT</span>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{branch.isVatInclusive ? "Đã bao gồm VAT" : "Chưa bao gồm VAT"}</span>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">{branch.defaultVatRate}%</span>
                            </div>
                        </div>
                        <div className="flex flex-col bg-white p-3 rounded-xl border border-amber-50">
                            <span className="text-xs text-gray-400 font-semibold mb-1">Phí dịch vụ</span>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{branch.applyServiceCharge ? "Có áp dụng" : "Không áp dụng"}</span>
                                {branch.applyServiceCharge && (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-xs font-bold">{branch.serviceChargeRate}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column: Description & Actions */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Description Card */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiFileText className="text-indigo-500" /> Mô tả chi nhánh
                    </h3>
                    <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                        {branch.description ? branch.description : <span className="italic text-gray-400">Chưa có thông tin mô tả cho chi nhánh này.</span>}
                    </div>
                </div>

                {/* Editor Column (Placeholder for Update Form) */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[250px] text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-500 flex items-center justify-center rounded-full mb-4">
                        <FiEdit3 className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Cập nhật thông tin</h3>
                    <p className="text-gray-500 text-sm max-w-md">Thay đổi tên, địa chỉ, sức chứa và các quy định đặt bàn của chi nhánh này.</p>
                    <Button onClick={() => setIsUpdateModalOpen(true)} variant="green" className="mt-6 px-6 py-2.5 rounded-xl font-semibold">Chỉnh sửa ngay</Button>
                </div>
            </div>

            <UpdateBranchForm
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                id_brand={id_brand}
                branch={branch}
            />
        </FadeIn>
    );
};

export default BranchOverviewTab;
