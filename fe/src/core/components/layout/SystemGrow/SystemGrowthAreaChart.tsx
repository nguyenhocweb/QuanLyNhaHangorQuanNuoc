"use client";

import { Div } from '../../ui';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// 1. Định nghĩa Type cho cấu hình của 1 đường/vùng (Thực thể)
export interface ChartSeriesConfig {
  dataKey: string; // Tên key trong data (vd: "users", "revenue")
  name: string;    // Tên hiển thị trên chú giải (vd: "Người đăng ký")
  color: string;   // Mã màu Hex
  yAxisId?: "left" | "right"; // Trục Y hiển thị (hỗ trợ scale khác nhau)
}

// 2. Định nghĩa Type cho Props của Component
interface DynamicAreaChartProps {
  title?: string;
  data: any[];                    // Nhận mảng dữ liệu động
  config: ChartSeriesConfig[];    // Nhận mảng cấu hình số lượng thực thể
  xAxisKey?: string;              // Tên key dùng cho trục X (mặc định là "name")
  height?: number | string;
}

export const DynamicAreaChart = ({
  title,
  data,
  config,
  xAxisKey = "name",
  height = 400,
}: DynamicAreaChartProps) => {
  
  // Nếu không có dữ liệu hoặc cấu hình, render UI trống
  if (!data?.length || !config?.length) {
    return <Div variant="bg_white" className="rounded-xl" style={{ height }}>Chưa có dữ liệu</Div>;
  }

  return (
    <Div vitri="col_none"  variant="bg_white" size='full' className=" p-4 " style={{ height: 'auto' }}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>}
      
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {/* RENDER ĐỘNG GRADIENT DỰA VÀO CONFIG */}
            <defs>
              {config.map((item) => (
                <linearGradient key={`grad-${item.dataKey}`} id={`color-${item.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={item.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} dy={10} />
            <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} />
            {config.some(item => item.yAxisId === "right") && (
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} />
            )}
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* RENDER ĐỘNG CÁC VÙNG (AREA) DỰA VÀO CONFIG */}
            {config.map((item) => (
              <Area 
                key={`area-${item.dataKey}`}
                type="monotone" 
                name={item.name} 
                dataKey={item.dataKey} 
                stroke={item.color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#color-${item.dataKey})`} 
                yAxisId={item.yAxisId || "left"}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Div>
  );
};

// cách dùng
// import { DynamicAreaChart } from "@/components/common/charts/DynamicAreaChart";

// export const RevenuePage = () => {
//   // Dữ liệu chỉ có doanh thu
//   const revenueData = [
//     { month: "Jan", revenue: 5000000 },
//     { month: "Feb", revenue: 8000000 },
//     { month: "Mar", revenue: 6500000 },
//   ];

//   // Cấu hình 1 thực thể
//   const revenueConfig = [
//     { dataKey: "revenue", name: "Doanh thu (VND)", color: "#ef4444" }, // Màu đỏ
//   ];

//   return (
//     <DynamicAreaChart 
//       title="Biểu đồ Doanh thu Quý 1" 
//       data={revenueData} 
//       config={revenueConfig} 
//       xAxisKey="month" // Đổi tên key trục X thành 'month' cho khớp với data
//     />
//   );
// }