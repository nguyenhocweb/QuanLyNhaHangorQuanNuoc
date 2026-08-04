import { Div, P, H } from "@/src/core/components/ui"
import BrandStatsComponent from "@/src/features/brand_owner/dashboard/components/BrandStatsComponent"
import BrandChartComponent from "@/src/features/brand_owner/dashboard/components/BrandChartComponent"
import BranchesListComponent from "@/src/features/brand_owner/dashboard/components/BranchesListComponent"
import RecentReviewsComponent from "@/src/features/brand_owner/dashboard/components/RecentReviewsComponent"

const BrandDashboardPage = () => {
    return (
        <Div vitri="col_none" size="full" className="p-4 md:p-10">
            <P className="text-gray-500">Chủ thương hiệu</P>
            <H variant="text_black" className="text-2xl font-bold">Bảng điều khiển tổng quan</H>
            
            <Div vitri="col_none" size="full" gap="g5_6" className="mt-6">
                <BrandStatsComponent />
                
                <Div size="full" className="lg:justify-between items-start flex-col lg:flex-row" gap="g4_5">
                    <Div vitri="col_none" className="w-full lg:w-2/3" gap="g5_6">
                        <BrandChartComponent />
                        <BranchesListComponent />
                    </Div>
                    
                    <Div vitri="col_none" className="w-full lg:w-1/3" gap="g5_6">
                        <RecentReviewsComponent />
                    </Div>
                </Div>
            </Div>
        </Div>
    )
}
export default BrandDashboardPage;
