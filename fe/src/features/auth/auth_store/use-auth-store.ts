// src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {User} from "../auth_types/login_type"
import { useAiStore } from '../../ai/store/useAiStore';

interface WorkspaceState {
    type: 'CUSTOMER' | 'BRAND' | 'RESTAURANT';
    id?: string;
    brandId?: string;
    restaurantId?: string;
    name?: string;
    role?: string;
    features?: Record<string, boolean> | null;
}

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    activeWorkspace: WorkspaceState;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
    switchWorkspace: (workspace: WorkspaceState) => void;
}

export const useAuthStore = create<AuthState>()(
    // Bọc toàn bộ store bằng hàm persist
    persist(
        (set) => ({
            // 1. State gốc khởi tạo ban đầu
            user: null,
            isAuthenticated: false,
            activeWorkspace: { type: 'CUSTOMER' },

            // 2. Action Login: Chỉ cập nhật State, KHÔNG CẦN gọi localStorage.setItem nữa
            login: (userData) => {
                let defaultWorkspaceType: 'CUSTOMER' | 'BRAND' | 'RESTAURANT' = 'CUSTOMER';
                let workspaceId = undefined;
                let workspaceName = undefined;
                let workspaceRole = undefined;
                let workspaceFeatures = undefined;

                const brandCount = userData.brand ? userData.brand.length : 0;
                const restCount = userData.restaurant ? userData.restaurant.length : 0;
                const totalWorkspaces = brandCount + restCount;

                // CHỈ auto-select nếu user có ĐÚNG 1 nơi làm việc
                if (totalWorkspaces === 1) {
                    if (brandCount === 1) {
                        defaultWorkspaceType = 'BRAND';
                        workspaceId = userData.brand![0].id;
                        workspaceName = userData.brand![0].name;
                        workspaceRole = userData.brand![0].role;
                        workspaceFeatures = userData.brand![0].features;
                    } else if (restCount === 1) {
                        defaultWorkspaceType = 'RESTAURANT';
                        workspaceId = userData.restaurant![0].id;
                        workspaceName = userData.restaurant![0].name;
                        workspaceRole = userData.restaurant![0].role;
                        workspaceFeatures = userData.restaurant![0].features;
                    }
                }
                // Nếu > 1 nơi làm việc, giữ nguyên là CUSTOMER (không có ID) để bắt buộc phải chọn

                set({ 
                    user: userData, 
                    isAuthenticated: true,
                    activeWorkspace: { type: defaultWorkspaceType, id: workspaceId, name: workspaceName, role: workspaceRole, features: workspaceFeatures }
                });
            },

            // 3. Action Logout
            logout: () => {
                useAiStore.getState().clearMessages();
                set({ user: null, isAuthenticated: false, activeWorkspace: { type: 'CUSTOMER' } });
            },
            updateUser: (updatedUser) => {
                set(state => {
                    if (state.user) {
                        return { user: { ...state.user, ...updatedUser } };
                    }
                    return state; // Nếu không có user, giữ nguyên state
                });
            },
            switchWorkspace: (workspace) => {
                useAiStore.getState().clearMessages();
                set(state => {
                    let role = workspace.role;
                    let features = workspace.features;
                    if (!role && state.user && workspace.id) {
                        if (workspace.type === 'BRAND') {
                            const b = state.user.brand?.find((x: any) => x.id === workspace.id);
                            if (b) {
                                role = b.role;
                                features = b.features;
                            }
                        } else if (workspace.type === 'RESTAURANT') {
                            const r = state.user.restaurant?.find((x: any) => x.id === workspace.id);
                            if (r) {
                                role = r.role;
                                features = r.features;
                            }
                        }
                    }
                    return { activeWorkspace: { ...workspace, role, features } };
                });
            }
        }),
        {
            name: 'auth-storage', // Tên Key sẽ lưu dưới LocalStorage
            storage: createJSONStorage(() => localStorage), 
            
            // SENIOR TIP: Không phải cái gì cũng lưu. Ví dụ bạn không muốn lưu isAuthenticated, 
            // chỉ muốn lưu user và token thôi.
            partialize: (state) => ({ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated,
                activeWorkspace: state.activeWorkspace
            }),
        }
    )
);