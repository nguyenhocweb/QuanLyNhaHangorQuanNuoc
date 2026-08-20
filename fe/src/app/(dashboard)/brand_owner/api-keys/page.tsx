"use client"
import React from 'react';
import { ApiKeyDashboard } from '@/src/features/brand_owner/api_keys/component/ApiKeyDashboard';

export default function BrandApiKeyPage() {
  return (
    <div className="p-6 h-full w-full">
      <ApiKeyDashboard />
    </div>
  );
}
