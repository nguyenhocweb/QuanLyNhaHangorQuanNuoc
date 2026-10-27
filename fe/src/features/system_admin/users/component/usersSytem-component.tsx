"use client";

import React, { useState } from "react";
import { 
  FiPlus, 
  FiSearch, 
  FiMessageSquare, 
  FiEdit2, 
  FiLock, 
  FiUnlock, 
  FiUsers, 
  FiUserPlus, 
  FiChevronLeft, 
  FiChevronRight, 
  FiLoader, 
  FiX, 
  FiRefreshCw, 
  FiShield, 
  FiCalendar, 
  FiCheckCircle, 
  FiCopy, 
  FiMail, 
  FiPhone, 
  FiFilter,
  FiUserCheck,
  FiUserX,
  FiArrowUpRight
} from "react-icons/fi";
import { MdOutlineStorefront, MdOutlineBusiness } from "react-icons/md";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useUsers } from "../hook/useUsersSytem";
import { RoleType, StatusType, User } from "../type/usersSytem-type";
import { FormCreateUsersSystemComponent } from "./formCreateUsersSytem-component";
import { FormUpdateUsersSystemComponent } from "./formUpdateUsersSytem-component";
import { ModalConfirmStatusSystemComponent } from "./modalConfirmStatusSystem-component";
import { toast } from "sonner";

export const getRoleUI = (role: any) => {
  const roleName = typeof role === 'object' && role !== null ? role.name : role;

  const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    "Admin": { 
      label: "Admin hệ thống", 
      className: "bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold", 
      icon: <FiShield className="text-rose-600 shrink-0" /> 
    },
    "Quản lý thương hiệu": { 
      label: "Quản lý thương hiệu", 
      className: "bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium", 
      icon: <MdOutlineBusiness className="text-indigo-600 shrink-0" /> 
    },
    "Chủ thương hiệu": { 
      label: "Chủ thương hiệu", 
      className: "bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-medium", 
      icon: <MdOutlineBusiness className="text-indigo-600 shrink-0" /> 
    },
    "Quản lý nhà hàng": { 
      label: "Quản lý nhà hàng", 
      className: "bg-blue-50 text-blue-700 border border-blue-200/60 font-medium", 
      icon: <MdOutlineStorefront className="text-blue-600 shrink-0" /> 
    },
    "Nhân viên": { 
      label: "Nhân viên", 
      className: "bg-purple-50 text-purple-700 border border-purple-200/60 font-medium", 
      icon: <FiUserCheck className="text-purple-600 shrink-0" /> 
    },
    "Khách hàng": { 
      label: "Khách hàng", 
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium", 
      icon: <FiUsers className="text-emerald-600 shrink-0" /> 
    }
  };
  return configs[roleName] || { 
    label: roleName || "Không xác định", 
    className: "bg-slate-50 text-slate-600 border border-slate-200 font-medium", 
    icon: <FiUsers className="text-slate-400 shrink-0" /> 
  };
};

export const getStatusUI = (status: StatusType) => {
  const configs: Record<StatusType, { label: string; className: string; dot: string }> = {
    ACTIVE: { 
      label: "Đang hoạt động", 
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", 
      dot: "bg-emerald-500 animate-pulse" 
    },
    PENDING: { 
      label: "Chờ xác minh", 
      className: "bg-amber-50 text-amber-700 border border-amber-200/60", 
      dot: "bg-amber-500" 
    },
    BANNED: { 
      label: "Đã bị khóa", 
      className: "bg-rose-50 text-rose-700 border border-rose-200/60", 
      dot: "bg-rose-500" 
    },
  };
  return configs[status] || { 
    label: "Không xác định", 
    className: "bg-slate-50 text-slate-600 border border-slate-200", 
    dot: "bg-slate-400" 
  };
};

const getInitial = (name: string) => {
  return name ? name.trim().charAt(0).toUpperCase() : '?';
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

const GlobalAccountManagement = () => {
  const {
    users, stats, meta, isLoading, isRefetching, isError, startItem, endItem, limit,
    searchTerm, setSearchTerm, roleFilter, setRoleFilter, statusFilter, setStatusFilter, dateFilter, setDateFilter,
    handleFilterChange, handlePageChange, handleLimitChange, resetFilters, isFiltersActive, refetch
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState<User | null>(null);
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<User | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  if (isError) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-rose-100 shadow-xs text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mb-4">
          <FiUserX />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Không thể tải danh sách tài khoản</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md">
          Đã có lỗi xảy ra trong quá trình truy vấn cơ sở dữ liệu. Vui lòng thử lại.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <FiRefreshCw className="text-sm" /> Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <FadeIn className="w-full flex flex-col gap-6">
      {/* TOP HEADER SECTION */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100/80">
              Hệ thống
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Quản trị phân quyền</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quản lý Tài khoản Toàn cầu
            </h1>
            {stats && (
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {stats.totalUsers.toLocaleString()} tài khoản
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Quản lý tập trung người dùng, vai trò, địa điểm làm việc và trạng thái truy cập trên toàn hệ thống Foleat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <FiRefreshCw className={`text-lg ${isRefetching ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold shadow-sm shadow-indigo-200/60 flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <FiPlus className="text-lg" />
            <span>Thêm tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Tổng người dùng */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md hover:border-indigo-200/80 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tổng người dùng
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {stats ? stats.totalUsers.toLocaleString() : "..."}
              </span>
              <span className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                Tất cả tài khoản trên hệ thống
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <FiUsers />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-80" />
        </div>

        {/* Metric 2: Người dùng mới */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md hover:border-emerald-200/80 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tài khoản mới
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  30 ngày qua
                </span>
              </div>
              <span className="text-3xl font-extrabold text-emerald-600 mt-2 tracking-tight">
                +{stats ? stats.newUsers30Days.toLocaleString() : "..."}
              </span>
              <span className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                Tăng trưởng thành viên mới
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <FiUserPlus />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-80" />
        </div>

        {/* Metric 3: Người dùng bị khóa */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md hover:border-rose-200/80 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tài khoản bị khóa
                </span>
                {stats && stats.lockedUsers > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/70">
                    Cần kiểm tra
                  </span>
                )}
              </div>
              <span className="text-3xl font-extrabold text-rose-600 mt-2 tracking-tight">
                {stats ? stats.lockedUsers.toLocaleString() : "..."}
              </span>
              <span className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                Bị khóa hoặc tạm ngừng quyền truy cập
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <FiLock />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600 opacity-80" />
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-xs flex flex-col gap-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleFilterChange(setSearchTerm)}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="w-full pl-10 pr-9 py-2.5 text-sm text-slate-800 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Vai trò */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <FiShield className="text-sm" />
              </div>
              <select
                value={roleFilter}
                onChange={handleFilterChange(setRoleFilter)}
                className="w-full pl-9 pr-8 py-2.5 text-sm text-slate-700 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="Chủ thương hiệu">Chủ thương hiệu</option>
                <option value="Quản lý nhà hàng">Quản lý nhà hàng</option>
                <option value="Nhân viên">Nhân viên</option>
                <option value="Khách hàng">Khách hàng</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Trạng thái */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <FiCheckCircle className="text-sm" />
              </div>
              <select
                value={statusFilter}
                onChange={handleFilterChange(setStatusFilter)}
                className="w-full pl-9 pr-8 py-2.5 text-sm text-slate-700 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="PENDING">Chờ xác minh</option>
                <option value="BANNED">Đã bị khóa</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Thời gian */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <FiCalendar className="text-sm" />
              </div>
              <select
                value={dateFilter}
                onChange={handleFilterChange(setDateFilter)}
                className="w-full pl-9 pr-8 py-2.5 text-sm text-slate-700 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="this_month">Tham gia tháng này</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Tag Row */}
        {isFiltersActive && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <FiFilter className="text-xs" /> Đang lọc theo:
            </span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                Từ khóa: &quot;{searchTerm}&quot;
                <button onClick={() => setSearchTerm("")} className="hover:text-rose-500 cursor-pointer">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}

            {roleFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                Vai trò: {roleFilter}
                <button onClick={() => setRoleFilter("all")} className="hover:text-rose-500 cursor-pointer">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}

            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                Trạng thái: {statusFilter === "ACTIVE" ? "Hoạt động" : statusFilter === "PENDING" ? "Chờ duyệt" : "Đã khóa"}
                <button onClick={() => setStatusFilter("all")} className="hover:text-rose-500 cursor-pointer">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}

            {dateFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-100">
                Thời gian: Tháng này
                <button onClick={() => setDateFilter("all")} className="hover:text-rose-500 cursor-pointer">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto hover:underline cursor-pointer flex items-center gap-1"
            >
              <FiX className="text-xs" /> Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-2">
                <FiLoader className="animate-spin text-indigo-600 text-3xl" />
                <span className="text-xs font-semibold text-slate-500">Đang cập nhật danh sách...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[11.5px] uppercase tracking-wider font-semibold border-b border-slate-200/80">
                <th className="py-4 px-6 w-[28%]">Người dùng</th>
                <th className="py-4 px-5 w-[22%]">Thông tin liên hệ</th>
                <th className="py-4 px-5 w-[16%]">Vai trò hệ thống</th>
                <th className="py-4 px-5 w-[18%]">Nơi làm việc</th>
                <th className="py-4 px-5 w-[11%]">Trạng thái</th>
                <th className="py-4 px-6 w-[8%] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((user) => {
                const roleUI = getRoleUI(user.role);
                const statusUI = getStatusUI(user.status);
                const roleName = typeof user.role === 'object' && user.role !== null ? (user.role as any).name : user.role;
                const isAdmin = roleName === 'Admin';

                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Cột 1: Người dùng */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 ring-2 ring-white shadow-xs"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-tr ${getAvatarGradient(user.name)} ring-2 ring-white shadow-xs`}>
                              {getInitial(user.name)}
                            </div>
                          )}
                          <span
                            title={user.isOnline ? "Đang trực tuyến" : "Ngoại tuyến"}
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <FiCalendar className="text-[11px]" />
                            {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Thông tin liên hệ */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium group/email">
                          <FiMail className="text-slate-400 shrink-0 text-xs" />
                          <span className="truncate">{user.email}</span>
                          <button
                            onClick={() => copyToClipboard(user.email, "email")}
                            className="opacity-0 group-hover/email:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 transition-opacity cursor-pointer"
                            title="Sao chép email"
                          >
                            <FiCopy className="text-xs" />
                          </button>
                        </div>
                        {user.phone ? (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <FiPhone className="text-slate-400 shrink-0 text-xs" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có số điện thoại</span>
                        )}
                      </div>
                    </td>

                    {/* Cột 3: Vai trò */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap ${roleUI.className}`}>
                        {roleUI.icon}
                        <span>{roleUI.label}</span>
                      </span>
                    </td>

                    {/* Cột 4: Nơi làm việc */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1.5 text-xs">
                        {(() => {
                          if (isAdmin) {
                            return (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50/80 text-rose-700 font-medium w-fit border border-rose-100">
                                <FiShield className="text-xs" /> Toàn hệ thống
                              </span>
                            );
                          }
                          if (roleName === "Khách hàng") {
                            return <span className="text-slate-400 italic">Khách hàng tự do</span>;
                          }
                          if (user.employments && user.employments.length > 0) {
                            return user.employments.map((emp, idx) => {
                              const placeName = emp.restaurant?.name || emp.brand?.name;
                              const isRestaurant = !!emp.restaurant;
                              if (!placeName) return null;
                              return (
                                <span
                                  key={idx}
                                  title={placeName}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium max-w-[220px] truncate border ${
                                    isRestaurant 
                                      ? 'bg-blue-50/80 text-blue-700 border-blue-100' 
                                      : 'bg-indigo-50/80 text-indigo-700 border-indigo-100'
                                  }`}
                                >
                                  {isRestaurant ? (
                                    <MdOutlineStorefront className="text-blue-500 shrink-0 text-sm" />
                                  ) : (
                                    <MdOutlineBusiness className="text-indigo-500 shrink-0 text-sm" />
                                  )}
                                  <span className="truncate">{placeName}</span>
                                </span>
                              );
                            });
                          }
                          return <span className="text-slate-400 italic">Chưa phân công nơi làm việc</span>;
                        })()}
                      </div>
                    </td>

                    {/* Cột 5: Trạng thái */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusUI.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusUI.dot}`} />
                        <span>{statusUI.label}</span>
                      </span>
                    </td>

                    {/* Cột 6: Thao tác */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Nút gửi tin nhắn */}
                        <button
                          onClick={() => toast("Tính năng trò chuyện trực tiếp đang phát triển!", { icon: "💬" })}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                          title="Gửi tin nhắn"
                        >
                          <FiMessageSquare className="text-base" />
                        </button>

                        {/* Nút sửa */}
                        <button
                          onClick={() => {
                            if (isAdmin) {
                              toast.error("Không có quyền chỉnh sửa tài khoản Admin hệ thống!");
                            } else {
                              setSelectedUserForUpdate(user);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                          title="Chỉnh sửa thông tin"
                        >
                          <FiEdit2 className="text-base" />
                        </button>

                        {/* Nút Khóa/Mở khóa */}
                        {user.status !== 'PENDING' && (
                          <button
                            onClick={() => {
                              if (isAdmin) {
                                toast.error("Không có quyền khóa hoặc mở khóa tài khoản Admin hệ thống!");
                              } else {
                                setSelectedUserForStatus(user);
                              }
                            }}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              user.status === 'BANNED'
                                ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={user.status === 'BANNED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {user.status === 'BANNED' ? (
                              <FiUnlock className="text-base text-emerald-600" />
                            ) : (
                              <FiLock className="text-base" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {!isLoading && users.length === 0 && (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mb-3">
              <FiSearch />
            </div>
            <h4 className="text-base font-bold text-slate-800">Không tìm thấy người dùng nào</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Không có tài khoản nào khớp với bộ lọc hoặc từ khóa tìm kiếm hiện tại của bạn.
            </p>
            {isFiltersActive && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FiRefreshCw className="text-xs" /> Đặt lại tất cả bộ lọc
              </button>
            )}
          </div>
        )}

        {/* PAGINATION BAR */}
        <div className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-white">
          <div className="text-xs text-slate-500">
            Hiển thị <span className="font-semibold text-slate-800">{startItem}</span> - <span className="font-semibold text-slate-800">{endItem}</span> trên tổng số <span className="font-semibold text-slate-800">{meta.totalRecords.toLocaleString()}</span> người dùng
          </div>

          <div className="flex items-center gap-4">
            {/* Limit Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Hiển thị:</span>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="py-1 px-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
                <option value="50">50 / trang</option>
              </select>
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(meta.currentPage - 1)}
                  disabled={meta.currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Trang trước"
                >
                  <FiChevronLeft className="text-base" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (meta.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (meta.currentPage >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i;
                  } else {
                    pageNum = meta.currentPage - 2 + i;
                  }

                  const isActive = pageNum === meta.currentPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(meta.currentPage + 1)}
                  disabled={meta.currentPage === meta.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Trang sau"
                >
                  <FiChevronRight className="text-base" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isCreateModalOpen && (
        <FormCreateUsersSystemComponent onClose={() => setIsCreateModalOpen(false)} />
      )}

      {selectedUserForUpdate && (
        <FormUpdateUsersSystemComponent 
          user={selectedUserForUpdate} 
          onClose={() => setSelectedUserForUpdate(null)} 
        />
      )}

      {selectedUserForStatus && (
        <ModalConfirmStatusSystemComponent 
          user={selectedUserForStatus} 
          onClose={() => setSelectedUserForStatus(null)} 
        />
      )}
    </FadeIn>
  );
};

export default GlobalAccountManagement;