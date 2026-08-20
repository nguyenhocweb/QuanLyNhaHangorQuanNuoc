"use client";
import FadeIn from "@/src/core/components/animation/FadeIn";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiCheck, FiX, FiExternalLink, FiClock } from "react-icons/fi";
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
  }>({
    isOpen: false,
    type: "success",
    title: "",
    content: "",
    targetId: null,
    actionType: null,
    planId: "",
  });

  const openConfirmModal = (request: AdminUpgradeRequest, type: "APPROVED" | "REJECTED") => {
    if (type === "APPROVED") {
      // Tìm gói Free mặc định (price = 0) nếu có
      const defaultFreePlan = plans.find(p => p.price === 0);
      
      setConfirmModal({
        isOpen: true,
        type: "success",
        title: "Phê duyệt yêu cầu nâng cấp",
        content: `Bạn có chắc chắn muốn phê duyệt yêu cầu trở thành đối tác của Khách hàng: ${request.user.name} cho Thương hiệu "${request.brandName}"? Hệ thống sẽ tự động tạo Thương hiệu mới.`,
        targetId: request.id,
        actionType: "APPROVED",
        planId: defaultFreePlan ? defaultFreePlan.id : (plans.length > 0 ? plans[0].id : ""),
      });
    } else {
      setConfirmModal({
        isOpen: true,
        type: "danger",
        title: "Từ chối yêu cầu nâng cấp",
        content: `Bạn có chắc chắn muốn từ chối yêu cầu nâng cấp tài khoản của Khách hàng: ${request.user.name}?`,
        targetId: request.id,
        actionType: "REJECTED",
        planId: "",
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
        planId: confirmModal.actionType === "APPROVED" ? confirmModal.planId : undefined
      });
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
<FadeIn>

    <Div variant="bg_white" vitri="col_none" size="full" className="p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <H variant="text_black" className="text-2xl font-bold">
            Yêu cầu nâng cấp đối tác
          </H>
          <P className="text-gray-500">Quản lý và phê duyệt các yêu cầu đăng ký thương hiệu mới.</P>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên thương hiệu..."
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
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Thương hiệu yêu cầu</th>
              <th className="p-4 font-semibold text-gray-600">Giấy phép KD</th>
              <th className="p-4 font-semibold text-gray-600">Ngày gửi</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
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
              data?.data?.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{req.user.name}</div>
                    <div className="text-sm text-gray-500">{req.user.email}</div>
                    <div className="text-sm text-gray-500">{req.user.sdt}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-amber-600">{req.brandName}</div>
                    <div className="text-sm text-gray-500">MST: {req.taxCode || "Không có"}</div>
                  </td>
                  <td className="p-4">
                    {req.businessLicense ? (
                      <a 
                        href={req.businessLicense} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Image src={req.businessLicense} alt="License" width={40} height={40} className="rounded-md object-cover border" />
                        <span className="flex items-center gap-1"><FiExternalLink /> Xem</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Không có</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(req.createdAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-4">
                    {req.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <FiClock /> Chờ duyệt
                      </span>
                    )}
                    {req.status === "APPROVED" && (
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <FiCheck /> Đã duyệt
                      </span>
                    )}
                    {req.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <FiX /> Từ chối
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {req.status === "PENDING" ? (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="green"
                          sizea="p4_2"
                          className="px-3 py-1.5 text-xs h-auto"
                          onClick={() => openConfirmModal(req, "APPROVED")}
                        >
                          Phê duyệt
                        </Button>
                        <Button
                          variant="red"
                          sizea="p4_2"
                          className="px-3 py-1.5 text-xs h-auto"
                          onClick={() => openConfirmModal(req, "REJECTED")}
                        >
                          Từ chối
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-sm text-gray-400">-</div>
                    )}
                  </td>
                </tr>
              ))
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

      <ConfirmModal
        open={confirmModal.isOpen}
        title={confirmModal.title}
        content={
          <div className="space-y-4">
            <p>{confirmModal.content}</p>
            {confirmModal.actionType === "APPROVED" && (
              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Chọn gói cước cấp phát <span className="text-red-500">*</span>
                </label>
                {isLoadingPlans ? (
                  <div className="text-sm text-gray-500">Đang tải danh sách gói cước...</div>
                ) : (
                  <Select
                    value={confirmModal.planId}
                    onChange={(e) => setConfirmModal({ ...confirmModal, planId: e.target.value })}
                    className="w-full text-black"
                  >
                    <option value="" disabled>-- Vui lòng chọn gói cước --</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString("vi-VN")}đ`} 
                        ({plan.billingCycle === "MONTHLY" ? "Tháng" : plan.billingCycle === "YEARLY" ? "Năm" : "Trọn đời"})
                      </option>
                    ))}
                  </Select>
                )}
              </div>
            )}
          </div>
        }
        type={confirmModal.type}
        confirmText={confirmModal.actionType === "APPROVED" ? "Phê duyệt" : "Từ chối"}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirm}
        isLoading={isUpdating}
      />
    </Div>
  
</FadeIn>
);
};
