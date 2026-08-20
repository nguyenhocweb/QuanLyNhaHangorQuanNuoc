"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAiStore } from '../store/useAiStore';
import { useAiStreaming } from '../hooks/useAiStreaming';
import { FaTimes, FaCommentDots, FaPaperPlane, FaRobot } from 'react-icons/fa';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';

import { toast } from 'sonner';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { FaLock } from 'react-icons/fa';

export default function ManagerAiSidebar() {
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
      toast.error("Gói cước của Thương hiệu hiện tại không hỗ trợ Trợ lý AI. Vui lòng nâng cấp!", {
        position: 'top-center'
      });
      return;
    }
    toggleChat();
  };

  return (
    <>
      {/* Nút gọi Sidebar - Ultra Premium FAB */}
      <div className={`fixed inset-0 z-50 pointer-events-none ${isOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
        <Draggable 
          nodeRef={fabRef} 
          bounds="parent"
          onStart={() => { dragRef.current = false; }}
          onDrag={() => { dragRef.current = true; }}
        >
          <div ref={fabRef} className="absolute bottom-8 right-8 cursor-grab active:cursor-grabbing touch-none pointer-events-auto">
            <button 
              onClick={handleToggle}
              className={`h-16 px-7 text-white rounded-full transition-all duration-300 flex items-center justify-center gap-3 border backdrop-blur-sm ${
                hasAi
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.8)] hover:shadow-[0_15px_50px_-10px_rgba(79,70,229,1)] hover:scale-105 border-white/20'
                  : 'bg-gradient-to-r from-gray-500 to-slate-600 opacity-90 cursor-not-allowed border-white/10 shadow-lg'
              }`}
            >
              {hasAi ? <FaCommentDots size={24} className="animate-pulse drop-shadow-lg" /> : <FaLock size={20} className="drop-shadow-lg" />}
              <span className="font-bold whitespace-nowrap tracking-wider text-base">Trợ lý Marcus</span>
            </button>
          </div>
        </Draggable>
      </div>

      {/* Sidebar trượt từ phải - Dark Glassmorphism */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[420px] bg-slate-900/85 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-slate-700/50 z-[100] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header - Dark Sleek Glow */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 border-b border-slate-700/60 flex justify-between items-center shrink-0 relative overflow-hidden">
          {/* Subtle colorful glow in header for dark mode */}
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] border border-white/10 transform hover:scale-105 transition-transform duration-300">
              <FaRobot className="text-white drop-shadow-md" size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-100 flex items-center gap-2">
                Marcus
                <span className="relative flex h-3 w-3 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Manager AI</p>
            </div>
          </div>
          <button onClick={toggleChat} className="relative z-10 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white p-2.5 rounded-xl shadow-sm border border-slate-600/50 transition-all duration-200">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          
          {/* Welcome Message */}
          <div className="flex flex-col gap-1.5 self-start w-full">
            <div className="flex items-center gap-2 px-1 text-slate-300">
              <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm border border-white/10">
                <FaRobot className="text-white text-[11px]" />
              </div>
              <span className="text-[13px] font-bold text-slate-200">Marcus</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Manager AI</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm p-4.5 px-5 rounded-2xl rounded-tl-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-slate-700/50 text-slate-200 max-w-[85%] text-[14.5px] leading-relaxed ml-2">
              Chào Quản lý! Tôi là <strong>Marcus</strong>, Trợ lý Điều hành của bạn. Hôm nay bạn cần tôi kiểm tra đơn hàng đang chờ, báo cáo kho, hay điều phối nhân sự?
            </div>
          </div>
          
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col w-full gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              {m.role !== 'user' && (
                <div className="flex items-center gap-2 px-1 text-slate-300">
                  <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm border border-white/10">
                    <FaRobot className="text-white text-[11px]" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-200">Marcus</span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Manager AI</span>
                </div>
              )}
              <div 
                className={`p-4.5 px-5 rounded-2xl text-[14.5px] max-w-[85%] leading-relaxed 
                ${m.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] whitespace-pre-wrap' 
                  : 'bg-slate-800/80 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-slate-700/50 text-slate-200 rounded-tl-sm ml-2'}`}
              >
                {m.role === 'user' ? (
                  m.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
                      li: ({ node, ...props }) => <li className="" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.3)]" {...props} />,
                      a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 hover:underline transition-colors" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mb-3" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-200 mb-2 mt-2" {...props} />
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex flex-col gap-1.5 self-start w-full">
              <div className="flex items-center gap-2 px-1 text-slate-300">
                <div className="w-7 h-7 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm border border-white/10">
                  <FaRobot className="text-white text-[11px]" />
                </div>
                <span className="text-[13px] font-bold text-slate-200">Marcus</span>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm py-3.5 px-5 rounded-2xl rounded-tl-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-slate-700/50 text-indigo-400 text-sm font-medium flex items-center gap-3 w-fit ml-2">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(99,102,241,0.5)]"></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(99,102,241,0.5)]" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(99,102,241,0.5)]" style={{animationDelay: '0.4s'}}></span>
                </div>
                <span className="opacity-90">Marcus đang phân tích...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area - Dark Mode */}
        <div className="p-6 bg-slate-900/70 backdrop-blur-xl border-t border-slate-700/60 shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.2)] relative z-10">
          <div className="flex items-center gap-3 relative">
            <div className="flex-1 bg-slate-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700 rounded-2xl pl-5 pr-14 py-4 flex items-center focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all duration-300">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ra lệnh cho Marcus..." 
                className="w-full bg-transparent border-none outline-none text-[15px] text-slate-200 placeholder:text-slate-500 font-medium"
                disabled={isTyping}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-11 h-11 rounded-xl flex items-center justify-center hover:shadow-[0_8px_20px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-75 transition-all duration-300 shrink-0"
            >
              <FaPaperPlane size={15} className="-translate-x-0.5 translate-y-0.5 drop-shadow-md" />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Powered by Antigravity AI</span>
          </div>
        </div>
      </div>
    </>
  );
}
