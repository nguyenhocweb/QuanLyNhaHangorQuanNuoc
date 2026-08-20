"use client";
import React from "react";
import { PosCashier } from "@/src/features/quan_ly_nha_hang/cashier/component/PosCashier";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

export default function CashierPage() {
  const { activeWorkspace } = useAuthStore();
  const currentRestaurantId = activeWorkspace?.id;

  if (!currentRestaurantId) return null;

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Màn hình Thu Ngân</h1>
      <PosCashier restaurantId={currentRestaurantId} />
    </div>
  );
}
