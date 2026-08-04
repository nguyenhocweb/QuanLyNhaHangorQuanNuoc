"use client";

import { JSX, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { Div, H } from "../../components/ui";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-2 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <Div 
        variant="bg_white" 
        shape="square" 
        className="relative w-full max-w-lg flex-col items-stretch overflow-hidden rounded-2xl !p-0 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <H variant="text_black" className="text-lg font-bold">
            {title}
          </H>
          <button
            type="button"
            className="rounded-lg bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </Div>
    </div>,
    document.body
  );
}
