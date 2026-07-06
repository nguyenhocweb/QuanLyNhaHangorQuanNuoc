"use client"

import { Div } from "@/src/core/components/ui";
import PublicBrands from "@/src/core/components/layout/public-brands";
import BrandFilterBar from "@/src/features/public/brands/components/BrandFilterBar";
import FeaturedBrandComponent from "@/src/features/public/brands/components/featured-brands-components";
import { Suspense } from "react";

const BrandPage = () => {
   
    return (
        <Suspense fallback={<Div>Loading...</Div>}>
            <Div vitri="col_none" gap='g5_6'>
                {/* giới thiêu */}
                <PublicBrands />
                <BrandFilterBar/>
                <Div className="px-10">
                <FeaturedBrandComponent type="page"/>
                </Div>
            </Div>
        </Suspense>
    )
}
export default BrandPage