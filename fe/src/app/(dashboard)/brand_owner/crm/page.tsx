"use client";

import React from 'react';
import { CrmDashboard } from '@/src/features/restaurant_manager/crm/components/CrmDashboard';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';

export default function BrandCrmPage() {
  const { activeWorkspace, user } = useAuthStore();
  
  // Lấy ID thương hiệu
  const brandId = activeWorkspace?.id || user?.brand?.[0]?.id || "";

  return (
    <div className="p-8 w-full min-h-screen bg-slate-50/50">
      <CrmDashboard level="brand" id={brandId} />
    </div>
  );
}
