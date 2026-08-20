export interface ApiKey {
  id: string;
  prefix: string;
  name: string;
  contactEmail: string | null;
  brandId: string | null;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  keyType: 'ADMIN_AI' | 'CUSTOMER_AI' | 'BRAND_SHARED_AI' | 'BRAND_SPECIFIC';
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyPayload {
  name: string;
  contactEmail?: string;
  keyType?: 'ADMIN_AI' | 'CUSTOMER_AI' | 'BRAND_SHARED_AI' | 'BRAND_SPECIFIC';
  expiresInDays?: number;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  prefix: string;
  rawKey: string; // CHỈ TRẢ VỀ 1 LẦN DUY NHẤT LÚC TẠO
  expiresAt: string | null;
}
