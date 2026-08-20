"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAiStore } from '../store/useAiStore';
import { useAiStreaming } from '../hooks/useAiStreaming';
import { FaShieldAlt, FaTimes, FaPaperPlane, FaServer } from 'react-icons/fa';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';

export default function AdminAiTerminal() {
  const { isOpen, toggleChat, messages } = useAiStore();
  const { sendMessage, isTyping } = useAiStreaming();
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

  return (
    <>
      {/* Nút FAB Premium */}
      <div className={`fixed inset-0 z-50 pointer-events-none ${isOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
        <Draggable 
          nodeRef={fabRef} 
          bounds="parent"
          onStart={() => { dragRef.current = false; }}
          onDrag={() => { dragRef.current = true; }}
        >
          <div ref={fabRef} className="absolute bottom-6 right-6 cursor-grab active:cursor-grabbing pointer-events-auto">
            <button 
              onClick={(e) => {
                if (dragRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                toggleChat();
              }}
              className="h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center px-6 gap-2 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
            >
              <FaShieldAlt size={22} />
              <span className="font-semibold whitespace-nowrap tracking-wide">System Copilot</span>
            </button>
          </div>
        </Draggable>
      </div>

      {/* Sidebar trượt từ phải - Giao diện Glassmorphism */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[420px] bg-slate-900/95 backdrop-blur-xl shadow-2xl border-l border-white/10 z-[100] transform transition-transform duration-400 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/80 to-cyan-900/80 p-5 text-white flex justify-between items-center shrink-0 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shadow-inner">
              <FaServer className="text-cyan-400" size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white">System Admin AI</h3>
              <p className="text-xs text-cyan-200/70 font-medium tracking-wider uppercase mt-0.5">Core Control Center</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Khu vực Chat */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="self-start bg-cyan-950/50 border border-cyan-800/50 p-4 rounded-2xl rounded-tl-sm shadow-sm text-cyan-50 max-w-[90%] text-sm leading-relaxed">
            Xin chào Admin! Tôi là SysAdmin. Hệ thống đang hoạt động ổn định. Bạn muốn kiểm tra Log lỗi, quản lý API Keys hay tạo mới thương hiệu?
          </div>
          
          {messages.map((m) => (
            <div key={m.id} className={`w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`p-4 rounded-2xl max-w-[90%] text-sm leading-relaxed shadow-md ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-sm whitespace-pre-wrap' 
                    : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-tl-sm'
                }`}
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
                      strong: ({ node, ...props }) => <strong className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" {...props} />,
                      a: ({ node, ...props }) => <a className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mb-3" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-bold text-cyan-200 mb-2 mt-2" {...props} />
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="w-full flex justify-start">
              <div className="p-4 rounded-2xl max-w-[90%] text-sm leading-relaxed shadow-md bg-slate-800/80 border border-white/5 text-slate-400 rounded-tl-sm italic">
                Copilot đang phân tích hệ thống...
              </div>
            </div>
          )}
        </div>

        {/* Khu vực Nhập lệnh */}
        <div className="p-5 bg-slate-900/80 border-t border-white/10 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3.5 flex items-center focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-500/50 transition-all shadow-inner">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập yêu cầu quản trị hệ thống..." 
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500"
                disabled={isTyping}
              />
            </div>
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all shadow-md shrink-0"
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
