"use client"
import React from 'react';
import { ApiKeysDashboard } from '@/src/features/system_admin/api_keys/component/ApiKeysDashboard';

export default function SystemApiKeyPage() {
  return (
    <div className="p-6 h-full w-full">
      <ApiKeysDashboard />
    </div>
  );
}
