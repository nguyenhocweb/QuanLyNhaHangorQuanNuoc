"use client"
import React from 'react'
import { Div, H } from '@/src/core/components/ui'
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store'
import { ManagerPromotionsDashboard } from '@/src/features/restaurant_manager/promotions/components/ManagerPromotionsDashboard'
import { StaffPromotionsScanner } from '@/src/features/restaurant_manager/promotions/components/StaffPromotionsScanner'

export default function PromotionsPage() {
  const { user } = useAuthStore()

  // Trong thực tế sẽ lấy từ user.role, hiện tại ta giả định nếu là "Quản lý nhà hàng" hoặc có quyền quản lý thì hiện Dashboard
  // Các quyền khác như "Nhân viên" thì hiện Scanner.
  const isManager = user?.role === 'Quản lý nhà hàng' || user?.role === 'Quản lý thương hiệu'

  return (
    <Div vitri="col_none" className="w-full h-full p-6 bg-slate-50 min-h-screen">
      {isManager ? (
        <ManagerPromotionsDashboard />
      ) : (
        <StaffPromotionsScanner />
      )}
    </Div>
  )
}
