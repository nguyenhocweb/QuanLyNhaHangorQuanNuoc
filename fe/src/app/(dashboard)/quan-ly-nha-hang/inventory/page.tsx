"use client"
import React, { useState } from 'react'
import { Div, H } from '@/src/core/components/ui'
import { ManagerInventoryDashboard } from '@/src/features/quan_ly_nha_hang/inventory/components/ManagerInventoryDashboard'
import { ManagerInventoryStocksTab } from '@/src/features/quan_ly_nha_hang/inventory/components/ManagerInventoryStocksTab'
import { ManagerPurchaseRequestsTab } from '@/src/features/quan_ly_nha_hang/inventory/components/ManagerPurchaseRequestsTab'
import { BsStack, BsClipboardCheck, BsCartPlus } from 'react-icons/bs'
import FadeIn from '@/src/core/components/animation/FadeIn'

export default function ManagerInventoryPage() {
  const [activeTab, setActiveTab] = useState('inventory_stocks')

  return (
    <FadeIn className="w-full h-full">
      <Div vitri="col_none" className="w-full h-full p-6 bg-gray-50/50 gap-6">
        <div className="w-full mb-2">
          <H size="h4" className="text-gray-800 font-bold tracking-tight">Quản lý Kho Nhà Hàng</H>
          <p className="text-gray-500 mt-1 text-sm">Theo dõi tồn kho, yêu cầu nhập kho và kiểm kê định kỳ.</p>
        </div>

        {/* Custom Tabs Navigation */}
        <Div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 flex gap-2">
          <button 
            onClick={() => setActiveTab('inventory_stocks')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'inventory_stocks' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsStack className="text-lg" />
            Tồn kho Chi nhánh
          </button>
          <button 
            onClick={() => setActiveTab('purchase_requests')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'purchase_requests' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsCartPlus className="text-lg" />
            Yêu cầu nhập kho
          </button>
          <button 
            onClick={() => setActiveTab('stock_counts')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'stock_counts' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsClipboardCheck className="text-lg" />
            Phiếu kiểm kho
          </button>
        </Div>

        {/* Tab Content */}
        <Div className="w-full flex-1">
          {activeTab === 'inventory_stocks' && <ManagerInventoryStocksTab />}
          {activeTab === 'purchase_requests' && <ManagerPurchaseRequestsTab />}
          {activeTab === 'stock_counts' && <ManagerInventoryDashboard />}
        </Div>
      </Div>
    </FadeIn>
  )
}
