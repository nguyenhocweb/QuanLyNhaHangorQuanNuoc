"use client";


import { FiPlus, FiSearch, FiMessageSquare, FiEdit2, FiLock, FiUnlock, FiUsers, FiUserPlus, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { Div, H, P, Button, Input, Select } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";

import { useUsers } from "../hook/useUsersSytem";
import { RoleType, StatusType } from "../type/usersSytem-type";
import { useState } from "react";
import { FormCreateUsersSystemComponent } from "./formCreateUsersSytem-component";
import { FormUpdateUsersSystemComponent } from "./formUpdateUsersSytem-component";
import { ModalConfirmStatusSystemComponent } from "./modalConfirmStatusSystem-component";
import { User } from "../type/usersSytem-type";
import { toast } from "sonner";

export const getRoleUI = (role: any) => {
  const roleName = typeof role === 'object' && role !== null ? role.name : role;

  const configs: Record<string, { label: string; className: string }> = {
    "Admin": { label: "Admin hệ thống", className: "bg-red-50 text-red-500" },
    "Quản lý thương hiệu": { label: "Quản lý thương hiệu", className: "bg-indigo-50 text-indigo-600" },
    "Chủ thương hiệu": { label: "Chủ thương hiệu", className: "bg-indigo-50 text-indigo-600" },
    "Quản lý nhà hàng": { label: "Quản lý nhà hàng", className: "bg-blue-50 text-blue-600" },
    "Nhân viên": { label: "Nhân viên", className: "bg-purple-50 text-purple-600" },
    "Khách hàng": { label: "Khách hàng", className: "bg-green-50 text-green-600" }
  };
  return configs[roleName] || { label: "Không xác định", className: "bg-gray-50 text-gray-500" };
};

export const getStatusUI = (status: StatusType) => {
  const configs: Record<StatusType, { label: string; className: string; dot: string }> = {
    ACTIVE: { label: "Hoạt động", className: "bg-green-50 text-green-600 whitespace-nowrap", dot: "bg-green-500" },
    PENDING: { label: "Chờ xác minh", className: "bg-orange-50 text-orange-500 whitespace-nowrap", dot: "bg-orange-400" },
    BANNED: { label: "Đã khóa", className: "bg-red-50 text-red-500 whitespace-nowrap", dot: "bg-red-500" },
  };
  return configs[status] || { label: "Không xác định", className: "bg-gray-50 text-gray-500 whitespace-nowrap", dot: "bg-gray-400" };
};

const getInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const GlobalAccountManagement = () => {
  const {
    users, stats, meta, isLoading, isError, startItem, endItem, limit,
    searchTerm, setSearchTerm, roleFilter, setRoleFilter, statusFilter, setStatusFilter, dateFilter, setDateFilter,
    handleFilterChange, handlePageChange, handleLimitChange, resetFilters
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState<User | null>(null);
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<User | null>(null);

  if (isError) {
    return <div className="p-10 text-center text-red-500">Đã có lỗi xảy ra khi tải dữ liệu!</div>;
  }

  return (
    <Div className="min-h-screen bg-gray-50/30 p-4 md:p-8 w-full font-sans" vitri="col_none">
      <FadeIn className="w-full max-w-[1250px] mx-auto">
        <Div variant="bg_white" shape="square" className="w-full flex-col gap-6 !p-6 md:!p-8 !rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

        {/* HEADER */}
        <Div className="w-full justify-between flex-wrap gap-4 items-center border-b border-gray-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xl shadow-sm shadow-indigo-200"><FiUsers /></div>
            <div>
              <H variant="text_black" className="text-xl md:text-2xl font-bold text-gray-900">Quản lý Tài khoản Toàn cầu</H>
              <P className="text-sm text-gray-500 mt-1">Quản lý người dùng, vai trò và quyền truy cập hệ thống</P>
            </div>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} variant="default" shape="square" sizea="p4_2" className="flex items-center whitespace-nowrap gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-all">
            <FiPlus className="text-lg" /> Thêm tài khoản mới
          </Button>
        </Div>

        {/* STATS */}
        <Div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeIn delay={0.1}>
            <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-indigo-500 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl"><FiUsers /></div>
                <div className="flex flex-col">
                  <P className="text-[13.5px] text-gray-500 font-medium mb-1">Tổng người dùng</P>
                  <H variant="text_black" className="text-3xl font-bold text-gray-900">{stats ? stats.totalUsers.toLocaleString() : "..."}</H>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-green-500 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl"><FiUserPlus /></div>
                <div className="flex flex-col">
                  <P className="text-[13.5px] text-gray-500 font-medium mb-1">Tài khoản mới (30 ngày)</P>
                  <H variant="text_black" className="text-3xl font-bold text-green-600">+{stats ? stats.newUsers30Days.toLocaleString() : "..."}</H>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center justify-between border border-gray-100 border-l-[4px] border-l-red-400 rounded-2xl p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl"><FiLock /></div>
                <div className="flex flex-col">
                  <P className="text-[13.5px] text-gray-500 font-medium mb-1">Tài khoản bị khóa</P>
                  <H variant="text_black" className="text-3xl font-bold text-gray-900">{stats ? stats.lockedUsers.toLocaleString() : "..."}</H>
                </div>
              </div>
            </div>
          </FadeIn>
        </Div>

        {/* FILTERS */}
        <FadeIn delay={0.4} className="w-full">
          <Div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 mt-2">
            <div className="relative xl:col-span-4">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <Input
                value={searchTerm}
                onChange={handleFilterChange(setSearchTerm)}
                placeholder="Tìm kiếm người dùng..."
                className="pl-11 w-full text-gray-700 rounded-xl border-gray-200 h-[46px] focus:shadow-md transition-shadow"
              />
            </div>
            <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500 z-10 font-medium group-hover:text-indigo-500 transition-colors">Vai trò hệ thống</span>
                <Select value={roleFilter} onChange={handleFilterChange(setRoleFilter)} className="w-full text-gray-700 rounded-xl border-gray-200 h-[46px] bg-white focus:shadow-md transition-shadow">
                  <option value="all">Tất cả</option>
                  <option value="Chủ thương hiệu">Chủ thương hiệu</option>
                  <option value="Quản lý nhà hàng">Quản lý nhà hàng</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Khách hàng">Khách hàng</option>
                </Select>
              </div>
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500 z-10 font-medium group-hover:text-indigo-500 transition-colors">Trạng thái</span>
                <Select value={statusFilter} onChange={handleFilterChange(setStatusFilter)} className="w-full text-gray-700 rounded-xl border-gray-200 h-[46px] bg-white focus:shadow-md transition-shadow">
                  <option value="all">Tất cả</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="PENDING">Chờ xác minh</option>
                  <option value="BANNED">Đã khóa</option>
                </Select>
              </div>
              <div className="relative group">
                <span className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500 z-10 font-medium group-hover:text-indigo-500 transition-colors">Ngày tham gia</span>
                <Select value={dateFilter} onChange={handleFilterChange(setDateFilter)} className="w-full text-gray-700 rounded-xl border-gray-200 h-[46px] bg-white focus:shadow-md transition-shadow">
                  <option value="all">Tất cả</option>
                  <option value="this_month">Tháng này</option>
                </Select>
              </div>
            </div>
          </Div>
        </FadeIn>

        {/* TABLE */}
        <FadeIn delay={0.5} className="w-full overflow-x-auto mt-4 relative min-h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <FiLoader className="animate-spin text-indigo-500 text-3xl" />
            </div>
          )}
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[13px] border-b border-gray-100 font-medium">
                <th className="py-4 px-5 rounded-tl-xl w-[30%]">Người dùng</th>
                <th className="py-4 px-5">Liên hệ</th>
                <th className="py-4 px-5">Vai trò</th>
                <th className="py-4 px-5">Nơi làm việc</th>
                <th className="py-4 px-5">Trạng thái</th>
                <th className="py-4 px-5 rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleUI = getRoleUI(user.role);
                const statusUI = getStatusUI(user.status);

                return (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px] ${getAvatarColor(user.name)}`}>
                              {getInitial(user.name)}
                            </div>
                          )}
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{user.name}</span>
                          <span className="text-[12px] text-gray-400 mt-0.5">Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-[13px] text-gray-500 space-y-0.5">
                        <span className="text-gray-700">{user.email}</span>
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${roleUI.className}`}>{roleUI.label}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-[13px] text-gray-600 gap-1">
                        {(() => {
                          const roleName = typeof user.role === 'object' && user.role !== null ? (user.role as any).name : user.role;
                          if (roleName === "Admin") return <span className="font-medium text-indigo-600">Hệ thống</span>;
                          if (roleName === "Khách hàng") return <span className="text-gray-400 italic">-</span>;
                          if (user.employments && user.employments.length > 0) {
                            return user.employments.map((emp, idx) => {
                              const placeName = emp.restaurant?.name || emp.brand?.name;
                              const placeType = emp.restaurant ? "NH" : (emp.brand ? "TH" : "");
                              return placeName ? (
                                <span key={idx} className="font-medium bg-gray-100 px-2 py-0.5 rounded-md w-fit whitespace-nowrap">
                                  {placeType}: {placeName}
                                </span>
                              ) : null;
                            });
                          }
                          return <span className="text-gray-400 italic">Chưa phân công</span>;
                        })()}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium ${statusUI.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusUI.dot}`}></span>
                        {statusUI.label}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          onClick={() => toast("Tính năng nhắn tin đang phát triển!", { icon: "💬" })}
                          sizea="p2_1" 
                          className="text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-indigo-600 rounded-lg p-2 h-8 w-8 flex items-center justify-center"
                        >
                          <FiMessageSquare />
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const currentRoleName = typeof user.role === 'object' && user.role !== null ? (user.role as any).name : user.role;
                            if (currentRoleName === 'Admin') {
                              toast.error("Không có quyền chỉnh sửa tài khoản Admin hệ thống!");
                            } else {
                              setSelectedUserForUpdate(user);
                            }
                          }}
                          sizea="p2_1" 
                          className="text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-indigo-600 rounded-lg p-2 h-8 w-8 flex items-center justify-center"
                        >
                          <FiEdit2 />
                        </Button>
                        {user.status !== 'PENDING' && (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              const currentRoleName = typeof user.role === 'object' && user.role !== null ? (user.role as any).name : user.role;
                              if (currentRoleName === 'Admin') {
                                toast.error("Không có quyền khóa/mở khóa tài khoản Admin hệ thống!");
                              } else {
                                setSelectedUserForStatus(user);
                              }
                            }}
                            sizea="p2_1" 
                            className={`border-gray-200 hover:bg-gray-50 rounded-lg p-2 h-8 w-8 flex items-center justify-center ${user.status === 'BANNED' ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-red-600'}`}
                          >
                            {user.status === 'BANNED' ? <FiUnlock /> : <FiLock />}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!isLoading && users.length === 0 && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 rounded-b-xl">
              <FiSearch className="text-4xl text-gray-300 mb-3" />
              <p className="text-[14px]">Không tìm thấy người dùng nào phù hợp với bộ lọc.</p>
              <button onClick={resetFilters} className="text-indigo-600 text-[13px] mt-2 hover:underline">Xóa bộ lọc</button>
            </div>
          )}
        </FadeIn>



        {/* PAGINATION */}
        <Div className="w-full flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-50">
          <span className="text-[13px] text-gray-500">
            Hiển thị {startItem}-{endItem} trong {meta.totalRecords.toLocaleString()} kết quả
          </span>

          {meta.totalPages > 1 && (
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-1 text-[13px]">
                <button
                  onClick={() => handlePageChange(meta.currentPage - 1)}
                  disabled={meta.currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-50 transition-colors"
                ><FiChevronLeft /></button>

                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-medium">
                  {meta.currentPage}
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-gray-400">/</span>
                <span className="w-8 h-8 flex items-center justify-center text-gray-500 font-medium">
                  {meta.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(meta.currentPage + 1)}
                  disabled={meta.currentPage === meta.totalPages}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-50 transition-colors"
                ><FiChevronRight /></button>
              </div>

              <Select
                value={limit}
                onChange={handleLimitChange}
                className="text-[13px] text-gray-600 rounded-lg border-gray-200 h-8 py-0 px-2 pr-8 bg-white"
              >
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
                <option value="50">50 / trang</option>
              </Select>
            </div>
          )}
        </Div>
        </Div>
      </FadeIn>
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
    </Div>
  );
};

export default GlobalAccountManagement;