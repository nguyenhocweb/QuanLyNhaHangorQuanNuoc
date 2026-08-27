import { useState, useCallback } from 'react';
import { useAiStore, AiMessage } from '../store/useAiStore';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import axiosClient from '@/src/core/api/axios-instance';
import { toast } from 'sonner';

export const useAiStreaming = () => {
  const { addMessage, updateMessage, addPendingAction } = useAiStore();
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string, contextPayload: any) => {
    if (!content.trim()) return;

    const { user, activeWorkspace } = useAuthStore.getState();
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng AI.");
      return;
    }

    setIsTyping(true);
    
    const userMsgId = Date.now().toString();
    addMessage({
      id: userMsgId,
      role: 'user',
      content,
      type: 'text'
    });

    try {
      let endpoint = '';
      // Lấy role từ workspace hiện tại, nếu không có thì lấy systemRole của user
      const userRole = activeWorkspace?.role || user?.systemRole || user?.role;

      switch (userRole) {
        case 'Admin':
          endpoint = '/system-admin/ai/chat';
          break;
        case 'Chủ thương hiệu':
        case 'Quản lý thương hiệu':
          endpoint = '/brand-owner/ai/chat';
          break;
        case 'Quản lý nhà hàng':
          endpoint = `/restaurant-manager/${activeWorkspace?.id}/ai/chat`;
          break;
        case 'Khách hàng':
        case 'Nhân viên':
          endpoint = '/customer/ai/chat';
          break;
        default:
          throw new Error('Role không được hỗ trợ');
      }

      // Prepare payload (restaurantId có thể null nếu là Owner/Admin, backend sẽ tự xử lý)
      const payload = {
        prompt: content,
        sessionId: 'session-' + user.id,
        restaurantId: activeWorkspace?.id
      };

      const response = await axiosClient.post(endpoint, payload);
      
      const aiMsgId = (Date.now() + 1).toString();
      addMessage({
        id: aiMsgId,
        role: 'assistant',
        content: response.data?.metadata || response.data?.message || 'Không có phản hồi từ AI.',
        type: 'text'
      });
      
    } catch (error: any) {
      console.error("AI Error:", error);
      const aiMsgId = (Date.now() + 1).toString();
      addMessage({
        id: aiMsgId,
        role: 'assistant',
        content: error?.response?.data?.message || 'Hệ thống AI hiện đang bận hoặc bị lỗi. Vui lòng thử lại sau!',
        type: 'text'
      });
    } finally {
      setIsTyping(false);
    }

  }, [addMessage]);

  return { sendMessage, isTyping };
};
