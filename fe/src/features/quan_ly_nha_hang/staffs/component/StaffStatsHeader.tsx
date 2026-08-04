import React from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaUsers, FaUserTie, FaUserClock, FaMoneyBillWave } from "react-icons/fa";
import { IStaff } from "../type/staff.type";

interface StaffStatsHeaderProps {
  staffs: IStaff[];
  isLoading: boolean;
}

export default function StaffStatsHeader({ staffs, isLoading }: StaffStatsHeaderProps) {
  if (isLoading) return <div className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl mb-6"></div>;

  const totalStaff = staffs.length;
  const totalManagers = staffs.filter((s) => s.roleName === "Quản lý nhà hàng").length;
  const totalHourly = staffs.filter((s) => s.salary_type === "HOURLY").length;
  const totalMonthly = staffs.filter((s) => s.salary_type === "MONTHLY").length;

  const stats = [
    {
      title: "Tổng nhân sự",
      value: totalStaff,
      icon: <FaUsers className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Quản lý",
      value: totalManagers,
      icon: <FaUserTie className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      title: "Lương theo giờ",
      value: totalHourly,
      icon: <FaUserClock className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50",
      borderColor: "border-orange-100",
    },
    {
      title: "Lương cố định",
      value: totalMonthly,
      icon: <FaMoneyBillWave className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
      borderColor: "border-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <FadeIn key={idx} delay={idx * 0.1} className="w-full">
          <div
            className={`flex items-center gap-4 p-5 rounded-2xl bg-white border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">{stat.title}</span>
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
