"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';

// Lazy Load các Chatbox để tối ưu Bundle Size
// ssr: false vì Chatbox phụ thuộc vào LocalStorage (Zustand persist) và Window Object
const CustomerAiFab = dynamic(() => import('./CustomerAiFab'), { ssr: false });
const ManagerAiSidebar = dynamic(() => import('./ManagerAiSidebar'), { ssr: false });
const OwnerAiPalette = dynamic(() => import('./OwnerAiPalette'), { ssr: false });
const AdminAiTerminal = dynamic(() => import('./AdminAiTerminal'), { ssr: false });

export default function AiChatboxProvider() {
  const { user, activeWorkspace } = useAuthStore();

  // Không hiển thị nếu chưa đăng nhập (Trừ khi bạn muốn Customer xài mà ko cần đăng nhập)
  if (!user) {
    // Nếu là trang Public không có user, có thể mặc định là CustomerAiFab
    // return <CustomerAiFab />;
    return null;
  }

  // Lấy role: ưu tiên role trong workspace hiện tại, nếu không có thì lấy systemRole
  const userRole = activeWorkspace?.role || user?.systemRole;

  switch (userRole) {
    case 'Khách hàng':
    case 'Nhân viên':
      return <CustomerAiFab />;
    case 'Quản lý nhà hàng':
      return <ManagerAiSidebar />;
    case 'Chủ thương hiệu':
    case 'Quản lý thương hiệu':
      return <OwnerAiPalette />;
    case 'Admin':
      return <AdminAiTerminal />;
    default:
      console.warn("Unmatched role for AI Chatbox:", userRole);
      return null;
  }
}
