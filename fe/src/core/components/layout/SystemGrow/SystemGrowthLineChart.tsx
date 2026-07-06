"use client";

import React from 'react';
import { Div } from '../../ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// 1. Định nghĩa cấu hình cho từng đường (Thực thể)
export interface LineSeriesConfig {
  dataKey: string; // Tên biến trong data (vd: "users", "revenue")
  name: string;    // Tên hiển thị trên chú giải (vd: "Người đăng ký")
  color: string;   // Mã màu Hex
}

// 2. Props nhận vào cho cả Component
interface DynamicLineChartProps {
  title?: string;
  data: any[];                 // Mảng dữ liệu động
  config: LineSeriesConfig[];  // Mảng cấu hình các đường đồ thị
  xAxisKey?: string;           // Tên key của trục X (mặc định là "name")
  height?: number | string;
}

export const DynamicLineChart = ({
  title,
  data,
  config,
  xAxisKey = "name",
  height = 400,
}: DynamicLineChartProps) => {

  // Xử lý an toàn: Nếu không có data hoặc config thì báo lỗi thân thiện
  if (!data?.length || !config?.length) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100" style={{ height }}>
        <p className="text-gray-500">Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  return (
    <Div vitri="col_none"  variant="bg_white" size='full' className=" p-4 " style={{ height: 'auto' }}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>}
      
      <div className='w-full' style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {/* Lưới nền */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            {/* Trục X & Y */}
            <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} dy={10} minTickGap={20} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} />
            
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* RENDER ĐỘNG CÁC ĐƯỜNG DỰA VÀO CONFIG */}
            {config.map((item) => (
              <Line 
                key={`line-${item.dataKey}`}
                type="monotone" 
                name={item.name} 
                dataKey={item.dataKey} 
                stroke={item.color} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Div>
  );
};


// cách dùng

//  import { DynamicLineChart } from "@/src/components/common/charts/DynamicLineChart";

// export const MainDashboard = () => {
//   // Dữ liệu 12 tháng từ Backend trả về
//   const dashboardData = [
//     { month: "Thg 1", users: 400, brands: 24, restaurants: 24, bookings: 120 },
//     { month: "Thg 2", users: 300, brands: 13, restaurants: 22, bookings: 98 },
//     // ... các tháng khác
//   ];

//   // Định nghĩa sẽ vẽ 4 đường nào
//   const lineConfig = [
//     { dataKey: "users", name: "Người dùng", color: "#3b82f6" },
//     { dataKey: "brands", name: "Thương hiệu", color: "#10b981" },
//     { dataKey: "restaurants", name: "Nhà hàng", color: "#f59e0b" },
//     { dataKey: "bookings", name: "Lượt đặt bàn", color: "#8b5cf6" }, 
//   ];

//   return (
//     <DynamicLineChart 
//       title="Biểu đồ xu hướng toàn hệ thống" 
//       data={dashboardData} 
//       config={lineConfig}
//       xAxisKey="month" // Vì trong data gọi là 'month' thay vì 'name'
//     />
//   );
// }