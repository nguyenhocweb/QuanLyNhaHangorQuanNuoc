export interface ApiKey {
  id: string;
  name: string;
  encryptedKey: string;
  keyHash: string;
  prefix: string;
  keyType: 'ADMIN' | 'CUSTOMER' | 'BRAND';
  brandId: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  contactEmail: string | null;
  chatboxId: string;
  chatbox?: AiChatbox;
  restrictedModelId: string | null;
  restrictedModel?: AiModel | null;
  lastUsedAt: string | null;
  lastIp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiChatbox {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiModel {
  id: string;
  name: string;
  displayName: string;
  chatboxId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeysResponse {
  keys: ApiKey[];
  total: number;
  totalPages: number;
}
