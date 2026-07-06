"use client";

import React from 'react';
import { Div } from '../../ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// 1. Định nghĩa cấu hình cho từng Cột (Thực thể)
export interface BarSeriesConfig {
  dataKey: string; // Tên biến trong data (vd: "users", "brands")
  name: string;    // Tên hiển thị trên chú giải
  color: string;   // Mã màu Hex
}

// 2. Props nhận vào cho Component
interface DynamicBarChartProps {
  title?: string;
  data: any[];                 // Mảng dữ liệu động
  config: BarSeriesConfig[];   // Mảng cấu hình các cột
  xAxisKey?: string;           // Tên key của trục X (mặc định là "name")
  height?: number | string;
}

export const DynamicBarChart = ({
  title,
  data,
  config,
  xAxisKey = "name",
  height = 400,
}: DynamicBarChartProps) => {

  // Xử lý an toàn khi thiếu dữ liệu
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
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {/* Lưới nền */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            {/* Trục X & Y */}
            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 14 }} 
              dy={10} 
              minTickGap={20} // Tự động ẩn nhãn nếu màn hình Mobile quá hẹp
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 14 }} 
            />
            
            {/* Tooltip & Legend */}
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* RENDER ĐỘNG CÁC CỘT DỰA VÀO CONFIG */}
            {config.map((item) => (
              <Bar 
                key={`bar-${item.dataKey}`}
                name={item.name} 
                dataKey={item.dataKey} 
                fill={item.color} 
                radius={[4, 4, 0, 0]} // Vẫn giữ nguyên hiệu ứng bo góc trên rất đẹp của bạn
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Div>
  );
};

// cách dùng
// import { DynamicBarChart } from "@/src/components/common/charts/DynamicBarChart";

// export const SystemDashboard = () => {
//   // Dữ liệu mẫu 12 tháng (từ ví dụ trước)
//   const dashboardData = [
//     { month: "Thg 1", users: 400, brands: 24, restaurants: 24 },
//     { month: "Thg 2", users: 300, brands: 13, restaurants: 22 },
//     { month: "Thg 3", users: 550, brands: 45, restaurants: 50 },
//     // ...
//   ];

//   // Định nghĩa màu sắc và tên cột
//   const barConfig = [
//     { dataKey: "users", name: "Người dùng", color: "#3b82f6" },
//     { dataKey: "brands", name: "Thương hiệu", color: "#10b981" },
//     { dataKey: "restaurants", name: "Nhà hàng", color: "#f59e0b" },
//   ];

//   return (
//     <DynamicBarChart 
//       title="Biểu đồ so sánh khối lượng hàng tháng" 
//       data={dashboardData} 
//       config={barConfig}
//       xAxisKey="month" 
//     />
//   );
// }