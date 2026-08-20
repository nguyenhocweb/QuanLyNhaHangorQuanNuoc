"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAiStore } from '../store/useAiStore';
import { useAiStreaming } from '../hooks/useAiStreaming';
import { FaTimes, FaMagic, FaPaperPlane, FaChartLine } from 'react-icons/fa';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';

import { toast } from 'sonner';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { FaLock } from 'react-icons/fa';

export default function OwnerAiPalette() {
  const { isOpen, toggleChat, messages } = useAiStore();
  const { sendMessage, isTyping } = useAiStreaming();
  const { activeWorkspace } = useAuthStore();
  const hasAi = activeWorkspace?.features?.['AI_CHATBOT_BOOKING'] === true;

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue.trim(), {});
    setInputValue('');
  };

  const handleToggle = (e: any) => {
    if (dragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!hasAi) {
      toast.error("Gói cước hiện tại không hỗ trợ Trợ lý AI. Vui lòng nâng cấp gói cước!", {
        position: 'top-center'
      });
      return;
    }
    toggleChat();
  };

  return (
    <>
      {/* Nút FAB */}
      <div className={`fixed inset-0 z-[100] pointer-events-none ${isOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
        <Draggable 
          nodeRef={fabRef} 
          bounds="parent"
          onStart={() => { dragRef.current = false; }}
          onDrag={() => { dragRef.current = true; }}
        >
          <div ref={fabRef} className="absolute bottom-6 right-6 cursor-grab active:cursor-grabbing touch-none pointer-events-auto">
            <button 
              onClick={handleToggle}
              className={`h-14 rounded-full flex items-center justify-center px-5 gap-2 text-white shadow-lg transition-all duration-300 hover:scale-105 ${
                hasAi 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-90'
              }`}
            >
              {hasAi ? <FaMagic size={24} /> : <FaLock size={20} />}
              <span className="font-semibold whitespace-nowrap">Owner AI</span>
            </button>
          </div>
        </Draggable>
      </div>

      {/* Sidebar trượt từ phải */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[400px] bg-white shadow-2xl border-l border-amber-200 z-[100] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Trợ lý Thương hiệu</h3>
              <p className="text-xs text-amber-100">Owner AI</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-amber-100 hover:text-white p-2">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-amber-200">
          <div className="self-start bg-white p-4 rounded-xl shadow-sm border border-amber-100 text-slate-700 max-w-[90%] text-sm">
            Chào Sếp! Tôi là CEO Bot. Ngài muốn xem báo cáo doanh thu, duyệt chi tiêu hay xem tình hình kho hôm nay?
          </div>
          
          {messages.map((m) => (
            <div key={m.id} className={`p-4 rounded-xl shadow-sm text-sm max-w-[90%] ${m.role === 'user' ? 'self-end bg-amber-500 text-white whitespace-pre-wrap' : 'self-start bg-white border border-amber-100 text-slate-700'}`}>
              {m.role === 'user' ? (
                m.content
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
                    li: ({ node, ...props }) => <li className="" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-amber-600" {...props} />,
                    a: ({ node, ...props }) => <a className="text-amber-500 hover:text-amber-600 hover:underline transition-colors" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-900 mb-3" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-gray-900 mb-2 mt-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base font-bold text-gray-800 mb-2 mt-2" {...props} />
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="self-start bg-white p-4 rounded-xl shadow-sm border border-amber-100 text-slate-400 text-sm italic">
              AI đang tính toán dữ liệu...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Gõ lệnh (vd: Báo cáo doanh thu)..." 
                className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                disabled={isTyping}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="bg-amber-500 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-amber-600 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-sm shrink-0"
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
