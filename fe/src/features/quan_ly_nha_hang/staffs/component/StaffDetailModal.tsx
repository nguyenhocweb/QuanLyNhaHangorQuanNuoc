import React from "react";
import { Modal } from "@/src/core/components/layout/public-Modal";
import { Button } from "@/src/core/components/ui/Button";
import { FaUserCircle, FaEnvelope, FaPhone, FaBriefcase, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { IStaff } from "../type/staff.type";
import Image from "next/image";

interface StaffDetailModalProps {
  staff: IStaff | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffDetailModal({ staff, isOpen, onClose }: StaffDetailModalProps) {
  if (!staff) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Chi tiết nhân viên">
      <div className="space-y-6">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative rounded-xl">
          <div className="absolute -bottom-10 left-6">
            {staff.avatar ? (
              <Image 
                src={staff.avatar} 
                alt={staff.name} 
                width={80} 
                height={80} 
                className="rounded-full border-4 border-white shadow-sm object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-sm">
                <FaUserCircle className="w-12 h-12 text-slate-300" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-10 px-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{staff.name}</h2>
            <p className="text-sm text-slate-500">{staff.roleName}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <FaEnvelope className="text-slate-400" />
              </div>
              <span className="text-sm truncate">{staff.email || "Chưa cập nhật"}</span>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <FaPhone className="text-slate-400" />
              </div>
              <span className="text-sm">{staff.sdt || "Chưa cập nhật"}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <FaBriefcase className="text-slate-400" />
              </div>
              <span className="text-sm">{staff.roleName}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <FaMoneyBillWave className="text-slate-400" />
              </div>
              <span className="text-sm">
                {staff.salary_type === "HOURLY" ? "Lương theo giờ" : staff.salary_type === "MONTHLY" ? "Lương cố định" : "Chưa cập nhật"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <FaCalendarAlt className="text-slate-400" />
              </div>
              <span className="text-sm">
                Ngày tham gia: {new Date(staff.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
          <Button type="button" onClick={onClose} variant="black" sizea="p4_2">
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
