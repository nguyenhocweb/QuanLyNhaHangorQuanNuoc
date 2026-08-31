"use client";
import FadeIn from "@/src/core/components/animation/FadeIn";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiCheck, FiX, FiExternalLink, FiClock, FiEye, FiMapPin, FiPhone, FiMail, FiFileText, FiShield, FiBriefcase, FiUser } from "react-icons/fi";
import { H, P, Div, Button, Input, Select } from "@/src/core/components/ui";
import { Table } from "@/src/core/components/ui/Table";
import { useAdminUpgradeRequests, useUpdateAdminUpgradeRequestStatus } from "../hook/useUpgradeRequests_hook";
import { useGetSubscriptions } from "../../subscriptions/hook/useSubscription_hook";
import { AdminUpgradeRequest } from "../type/upgrade-request.type";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import Pagination from "@/src/core/components/layout/Pagination";
import Image from "next/image";

export const UpgradeRequestList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // State xem chi tiết hồ sơ
  const [selectedRequest, setSelectedRequest] = useState<AdminUpgradeRequest | null>(null);

  const { data, isLoading } = useAdminUpgradeRequests({
    page,
    limit,
    search,
    status: status === "all" ? undefined : status,
  });

  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateAdminUpgradeRequestStatus();
  
  // Lấy danh sách gói cước (không phân trang để lấy tất cả)
  const { data: plansData, isLoading: isLoadingPlans } = useGetSubscriptions({ limit: 100 });
  const plans = plansData?.data || [];

  // State cho Confirm Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "success" | "danger";
    title: string;
    content: string;
    targetId: string | null;
    actionType: "APPROVED" | "REJECTED" | null;
    planId: string;
    rejectionReason: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    content: "",
    targetId: null,
    actionType: null,
    planId: "",
    rejectionReason: "",
  });

  const openConfirmModal = (request: AdminUpgradeRequest, type: "APPROVED" | "REJECTED") => {
    if (type === "APPROVED") {
      const defaultFreePlan = plans.find(p => p.price === 0);
      
      setConfirmModal({
        isOpen: true,
        type: "success",
        title: "Phê duyệt yêu cầu nâng cấp",
        content: `Bạn có chắc chắn muốn phê duyệt hồ sơ đối tác cho Thương hiệu "${request.brandName}" của Khách hàng ${request.user.name}? Hệ thống sẽ tự động khởi tạo Thương hiệu mới với đầy đủ thông tin nhận diện, liên hệ và cấp quyền quản lý.`,
        targetId: request.id,
        actionType: "APPROVED",
        planId: defaultFreePlan ? defaultFreePlan.id : (plans.length > 0 ? plans[0].id : ""),
        rejectionReason: "",
      });
    } else {
      setConfirmModal({
        isOpen: true,
        type: "danger",
        title: "Từ chối yêu cầu nâng cấp",
        content: `Vui lòng nhập lý do từ chối hồ sơ đăng ký của Khách hàng: ${request.user.name}. Lý do này sẽ được gửi tới người nộp để bổ sung hồ sơ.`,
        targetId: request.id,
        actionType: "REJECTED",
        planId: "",
        rejectionReason: "Hồ sơ chưa đạt yêu cầu xác minh pháp lý của hệ thống.",
      });
    }
  };

  const handleConfirm = async () => {
    if (confirmModal.targetId && confirmModal.actionType) {
      if (confirmModal.actionType === "APPROVED" && !confirmModal.planId) {
        toast.error("Vui lòng chọn một Gói cước để gán cho Thương hiệu!");
        return;
      }
      
      await updateStatus({ 
        id: confirmModal.targetId, 
        status: confirmModal.actionType,
        planId: confirmModal.actionType === "APPROVED" ? confirmModal.planId : undefined,
        rejectionReason: confirmModal.actionType === "REJECTED" ? confirmModal.rejectionReason : undefined
      } as any);
      
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      if (selectedRequest && selectedRequest.id === confirmModal.targetId) {
        setSelectedRequest(null);
      }
    }
  };

  return (
    <FadeIn>
      <Div variant="bg_white" vitri="col_none" size="full" className="p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div>
            <H variant="text_black" className="text-2xl font-bold">
              Yêu Cầu Nâng Cấp Đối Tác
            </H>
            <P className="text-gray-500">Quản lý và thẩm định hồ sơ đăng ký thương hiệu (KYB) theo chuẩn doanh nghiệp.</P>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên thương hiệu, người đại diện..."
              className="pl-10 h-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 w-full text-black"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã phê duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 w-full">
          <Table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Thương hiệu</th>
                <th className="p-4 font-semibold text-gray-600">Người đại diện & Liên hệ</th>
                <th className="p-4 font-semibold text-gray-600">Trụ sở chính</th>
                <th className="p-4 font-semibold text-gray-600">Hồ sơ Pháp lý</th>
                <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Không tìm thấy yêu cầu nào.
                  </td>
                </tr>
              ) : (
                data?.data?.map((req) => {
                  const addressStr = req.address 
                    ? [req.address.street, req.address.ward, req.address.district, req.address.province].filter(Boolean).join(", ") 
                    : "Chưa cập nhật";

                  return (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Cột Thương hiệu */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 overflow-hidden flex items-center justify-center shrink-0">
                            {req.logo ? (
                              <img src={req.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <FiBriefcase className="text-amber-600 w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{req.brandName}</div>
                            <div className="text-xs text-gray-500">MST: <span className="font-mono text-gray-700">{req.tax_code || req.taxCode || "Chưa có"}</span></div>
                          </div>
                        </div>
                      </td>

                      {/* Cột Người đại diện & Liên hệ */}
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{req.representativeName || req.user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <FiPhone className="w-3 h-3 text-gray-400" />
                          <span>{req.phone_contact || req.user.sdt || "Chưa có"}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <FiMail className="w-3 h-3 text-gray-400" />
                          <span>{req.email_contact || req.user.email}</span>
                        </div>
                      </td>

                      {/* Cột Trụ sở */}
                      <td className="p-4 max-w-[220px]">
                        <div className="text-xs text-gray-700 line-clamp-2" title={addressStr}>
                          <FiMapPin className="inline-block w-3 h-3 text-amber-600 mr-1 shrink-0" />
                          {addressStr}
                        </div>
                      </td>

                      {/* Cột Hồ sơ Pháp lý */}
                      <td className="p-4">
                        {req.businessLicense ? (
                          <a 
                            href={req.businessLicense} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors border border-indigo-200/60"
                          >
                            <FiFileText className="w-3.5 h-3.5" />
                            <span>Xem GPKD</span>
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Chưa nộp</span>
                        )}
                      </td>

                      {/* Cột Trạng thái */}
                      <td className="p-4">
                        {req.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <FiClock className="w-3 h-3" /> Chờ duyệt
                          </span>
                        )}
                        {req.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FiCheck className="w-3 h-3" /> Đã duyệt
                          </span>
                        )}
                        {req.status === "REJECTED" && (
                          <div>
                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                              <FiX className="w-3 h-3" /> Đã từ chối
                            </span>
                            {req.rejectionReason && (
                              <p className="text-[11px] text-red-500 mt-1 max-w-[180px] truncate" title={req.rejectionReason}>
                                Lý do: {req.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Cột Thao tác */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            title="Xem chi tiết hồ sơ"
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          {req.status === "PENDING" && (
                            <>
                              <Button
                                variant="green"
                                sizea="p4_2"
                                className="px-3 py-1.5 text-xs h-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                                onClick={() => openConfirmModal(req, "APPROVED")}
                              >
                                Duyệt
                              </Button>
                              <Button
                                variant="red"
                                sizea="p4_2"
                                className="px-3 py-1.5 text-xs h-auto bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-sm"
                                onClick={() => openConfirmModal(req, "REJECTED")}
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>

        <div className="flex justify-center w-full mt-4">
          {(data?.totalPages || 0) > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data?.totalPages || 1}
              onPageChange={setPage}
              limit={limit}
            />
          )}
        </div>

        {/* Modal Xem Chi Tiết Toàn Diện Hồ Sơ Doanh Nghiệp */}
        {selectedRequest && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                    {selectedRequest.logo ? (
                      <img src={selectedRequest.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <FiBriefcase className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedRequest.brandName}</h3>
                    <p className="text-xs text-slate-300">Hồ sơ thẩm định đối tác thương hiệu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Người đại diện pháp luật:</span>
                    <span className="font-bold text-gray-900">{selectedRequest.representativeName || selectedRequest.user.name}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Mã số thuế:</span>
                    <span className="font-mono font-bold text-amber-700">{selectedRequest.tax_code || selectedRequest.taxCode || "Chưa đăng ký"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Hotline liên hệ:</span>
                    <span className="font-semibold text-gray-800">{selectedRequest.phone_contact || selectedRequest.user.sdt || "Chưa có"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Email hóa đơn / đối soát:</span>
                    <span className="font-semibold text-gray-800">{selectedRequest.email_contact || selectedRequest.user.email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 block mb-1">Địa chỉ trụ sở chính:</span>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium flex items-center gap-2">
                    <FiMapPin className="text-amber-600 w-4 h-4 shrink-0" />
                    <span>
                      {selectedRequest.address 
                        ? [selectedRequest.address.street, selectedRequest.address.ward, selectedRequest.address.district, selectedRequest.address.province].filter(Boolean).join(", ")
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                </div>

                {selectedRequest.description && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Giới thiệu thương hiệu:</span>
                    <p className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-xs leading-relaxed">
                      {selectedRequest.description}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-gray-500 block mb-2">Tài liệu pháp lý (KYB):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRequest.businessLicense ? (
                      <a
                        href={selectedRequest.businessLicense}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl flex items-center justify-between text-indigo-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FiFileText className="w-5 h-5 text-indigo-600" />
                          <div>
                            <p className="text-xs font-bold">Giấy phép kinh doanh</p>
                            <p className="text-[10px] text-indigo-600/70">Click để mở tài liệu</p>
                          </div>
                        </div>
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border text-xs text-gray-400">Không có GPKD</div>
                    )}

                    {selectedRequest.identityCard && selectedRequest.identityCard.length > 0 ? (
                      selectedRequest.identityCard.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FiShield className="w-5 h-5 text-emerald-600" />
                            <div>
                              <p className="text-xs font-bold">CCCD Người đại diện #{index + 1}</p>
                              <p className="text-[10px] text-emerald-600/70">Click để xem ảnh</p>
                            </div>
                          </div>
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      ))
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                <Button
                  type="button"
                  variant="white"
                  sizea="p4_2"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Đóng
                </Button>
                {selectedRequest.status === "PENDING" && (
                  <>
                    <Button
                      type="button"
                      variant="red"
                      sizea="p4_2"
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                      onClick={() => {
                        openConfirmModal(selectedRequest, "REJECTED");
                      }}
                    >
                      Từ chối
                    </Button>
                    <Button
                      type="button"
                      variant="green"
                      sizea="p4_2"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      onClick={() => {
                        openConfirmModal(selectedRequest, "APPROVED");
                      }}
                    >
                      Phê duyệt hồ sơ
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal Phê duyệt / Từ chối có nhập lý do */}
        <ConfirmModal
          open={confirmModal.isOpen}
          title={confirmModal.title}
          content={
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{confirmModal.content}</p>
              
              {confirmModal.actionType === "APPROVED" && (
                <div className="space-y-2 mt-4 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Gói cước cấp phát cho Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  {isLoadingPlans ? (
                    <div className="text-xs text-gray-500">Đang tải danh sách gói cước...</div>
                  ) : (
                    <Select
                      value={confirmModal.planId}
                      onChange={(e) => setConfirmModal({ ...confirmModal, planId: e.target.value })}
                      className="w-full text-black rounded-xl text-sm"
                    >
                      <option value="" disabled>-- Chọn gói cước khởi tạo --</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price === 0 ? "Miễn phí (0đ)" : `${plan.price.toLocaleString("vi-VN")}đ`} 
                          ({plan.billingCycle === "MONTHLY" ? "Tháng" : plan.billingCycle === "YEARLY" ? "Năm" : "Trọn đời"})
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              )}

              {confirmModal.actionType === "REJECTED" && (
                <div className="space-y-2 mt-4 text-left">
                  <label className="block text-xs font-bold text-gray-700">
                    Lý do từ chối hồ sơ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={confirmModal.rejectionReason}
                    onChange={(e) => setConfirmModal({ ...confirmModal, rejectionReason: e.target.value })}
                    placeholder="Nhập chi tiết lý do từ chối để đối tác bổ sung..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:ring-1 focus:ring-red-500 outline-none resize-none"
                  />
                </div>
              )}
            </div>
          }
          type={confirmModal.type}
          confirmText={confirmModal.actionType === "APPROVED" ? "Phê duyệt" : "Xác nhận từ chối"}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={handleConfirm}
          isLoading={isUpdating}
        />
      </Div>
    </FadeIn>
  );
};
