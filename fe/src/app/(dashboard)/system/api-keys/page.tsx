"use client"
import React from 'react';
import { ApiKeysDashboard } from '@/src/features/system_admin/api_keys/component/ApiKeysDashboard';

export default function SystemApiKeyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-h-full">
      <ApiKeysDashboard />
    </div>
  );
}
