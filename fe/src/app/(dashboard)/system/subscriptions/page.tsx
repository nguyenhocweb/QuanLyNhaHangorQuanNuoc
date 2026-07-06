"use client"
import React from 'react'
import { SubscriptionsList } from '@/src/features/system_admin/subscriptions/component/SubscriptionsList'

const SubscriptionsPage = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50/30">
      <SubscriptionsList />
    </div>
  )
}

export default SubscriptionsPage
