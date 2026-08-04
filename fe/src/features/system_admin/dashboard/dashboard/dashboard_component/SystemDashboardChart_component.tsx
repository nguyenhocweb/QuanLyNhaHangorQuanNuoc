"use client"
import FadeIn from "@/src/core/components/animation/FadeIn";
import { DynamicAreaChart } from "@/src/core/components/layout/SystemGrow/SystemGrowthAreaChart";
import { useDashboard_stat } from "../dashboard_hook/useDashboard_stas";

const chartConfig = [
    { dataKey: "revenue", name: "Doanh thu (Triệu VNĐ)", color: "#e11d48" }, // Đỏ hồng
];

const SystemDashboardChart_component = () => {
    const { data, isLoading } = useDashboard_stat();

    if (isLoading || !data) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải biểu đồ...</div>;
    }

    return (
        <FadeIn>
        <DynamicAreaChart
            title="Biểu đồ tổng quan Hệ thống & Doanh thu"
            data={data.chartData}
            config={chartConfig}
            xAxisKey="month"
        />
        </FadeIn>
    );
};

export default SystemDashboardChart_component;
