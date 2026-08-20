"use client"
import React, { useState } from 'react'
import { Div, H } from '@/src/core/components/ui'
import { SuppliersTab } from './SuppliersTab'
import { InventoryItemsTab } from './InventoryItemsTab'
import { PurchaseOrdersTab } from './PurchaseOrdersTab'
import { StockTransfersTab } from './StockTransfersTab'
import { BrandPurchaseRequestsTab } from './BrandPurchaseRequestsTab'
import { BsShop, BsBoxSeam, BsCartCheck, BsStack, BsClipboardCheck, BsTruck, BsListCheck } from 'react-icons/bs'
import FadeIn from '@/src/core/components/animation/FadeIn'
import { InventoryStocksTab } from './InventoryStocksTab'
import { StockCountsTab } from './StockCountsTab'

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('purchase_requests')

  const tabs = [
    { id: 'suppliers', label: 'Nhà cung cấp', icon: BsShop },
    { id: 'items', label: 'Hàng hóa & Nguyên liệu', icon: BsBoxSeam },
    { id: 'purchase_requests', label: 'Yêu cầu từ Chi nhánh', icon: BsListCheck },
    { id: 'purchase_orders', label: 'Nhập kho (PO)', icon: BsCartCheck },
    { id: 'inventory_stocks', label: 'Tồn kho Chi nhánh', icon: BsStack },
  ]

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full h-full gap-6 p-6 pb-20">
        <Div className="w-full justify-between items-center">
          <Div vitri="col_none">
            <H variant="text_black" className="text-2xl font-bold text-gray-800">Quản lý Kho hàng & Nhà cung cấp</H>
            <p className="text-gray-500 text-sm mt-1">Quản lý danh sách nguyên vật liệu và thông tin các nhà cung cấp của thương hiệu.</p>
          </Div>
        </Div>

        {/* Custom Tabs Navigation */}
        <Div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 flex gap-2">
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'items' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsBoxSeam className="text-lg" />
            Hàng hóa / Vật liệu
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'suppliers' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsShop className="text-lg" />
            Nhà cung cấp
          </button>
          <button 
            onClick={() => setActiveTab('purchase_requests')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'purchase_requests' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsListCheck className="text-lg" />
            Y/c từ Chi nhánh
          </button>
          <button 
            onClick={() => setActiveTab('purchase_orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'purchase_orders' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsCartCheck className="text-lg" />
            Nhập kho (PO)
          </button>
          <button 
            onClick={() => setActiveTab('inventory_stocks')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'inventory_stocks' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsStack className="text-lg" />
            Tồn kho Chi nhánh
          </button>
          <button 
            onClick={() => setActiveTab('stock_counts')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'stock_counts' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsClipboardCheck className="text-lg" />
            Kiểm kho
          </button>
          <button 
            onClick={() => setActiveTab('stock_transfers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'stock_transfers' ? 'bg-amber-50 text-amber-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <BsTruck className="text-lg" />
            Luân chuyển
          </button>
        </Div>

        {/* Tab Content */}
        <Div className="w-full mt-6">
          {activeTab === 'suppliers' && <SuppliersTab />}
          {activeTab === 'items' && <InventoryItemsTab />}
          {activeTab === 'purchase_requests' && <BrandPurchaseRequestsTab />}
          {activeTab === 'purchase_orders' && <PurchaseOrdersTab />}
          {activeTab === 'inventory_stocks' && <InventoryStocksTab />}
          {activeTab === 'stock_counts' && <StockCountsTab />}
          {activeTab === 'stock_transfers' && <StockTransfersTab />}
        </Div>
      </Div>
    </FadeIn>
  )
}

export default InventoryPage
