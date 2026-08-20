"use client";

import React from 'react';
import { CrmDashboard } from '@/src/features/restaurant_manager/crm/components/CrmDashboard';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';

export default function RestaurantCrmPage() {
  const { activeWorkspace } = useAuthStore();
  
  // Lấy ID nhà hàng từ workspace
  const restaurantId = activeWorkspace?.id || "";

  return (
    <div className="p-8 w-full min-h-screen bg-slate-50/50">
      <CrmDashboard level="restaurant" id={restaurantId} />
    </div>
  );
}
