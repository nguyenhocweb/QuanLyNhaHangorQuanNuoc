"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAiStore } from '../store/useAiStore';
import { useAiStreaming } from '../hooks/useAiStreaming';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';

export default function CustomerAiFab() {
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
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <Draggable 
          nodeRef={fabRef} 
          bounds="parent"
          onStart={() => { dragRef.current = false; }}
          onDrag={() => { dragRef.current = true; }}
        >
          <div ref={fabRef} className="absolute bottom-6 right-6 cursor-grab active:cursor-grabbing touch-none pointer-events-auto">
          {/* Nút FAB */}
          <button 
            onClick={(e) => {
              if (dragRef.current) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              toggleChat();
            }}
            className="h-14 bg-gradient-to-r from-orange-400 to-rose-500 rounded-full flex items-center justify-center px-5 gap-2 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
            {!isOpen && <span className="font-semibold whitespace-nowrap">Tư vấn viên AI</span>}
          </button>
        </div>
      </Draggable>
      </div>

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[99] w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-orange-400 to-rose-500 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <FaRobot size={20} />
              <span className="font-semibold text-lg">Trợ lý tư vấn</span>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <FaTimes size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-200">
            {/* Lịch sử chat sẽ render ở đây */}
            <div className="self-start bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-700 max-w-[85%] text-sm">
              Xin chào! Tôi là Mia, lễ tân ảo của nhà hàng. Hôm nay bạn muốn dùng món gì ạ?
            </div>
            
            {messages.map((m) => (
               <div key={m.id} className={`p-3 rounded-2xl shadow-sm text-sm max-w-[85%] ${m.role === 'user' ? 'self-end bg-orange-500 text-white rounded-tr-none whitespace-pre-wrap' : 'self-start bg-white text-gray-700 rounded-tl-none'}`}>
                 {m.role === 'user' ? (
                   m.content
                 ) : (
                   <ReactMarkdown
                     components={{
                       p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                       ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
                       ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
                       li: ({ node, ...props }) => <li className="" {...props} />,
                       strong: ({ node, ...props }) => <strong className="font-bold text-orange-600" {...props} />,
                       a: ({ node, ...props }) => <a className="text-orange-500 hover:text-orange-600 hover:underline transition-colors" {...props} />,
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
               <div className="self-start bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-400 text-sm italic">
                 AI đang trả lời...
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhắn tin cho AI..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700"
                disabled={isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !inputValue.trim()}
                className="text-orange-500 hover:text-orange-600 disabled:text-gray-400 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
