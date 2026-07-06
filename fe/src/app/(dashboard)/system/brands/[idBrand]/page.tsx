"use client"
import { Div } from "@/src/core/components/ui"
import { use } from "react";
import BrandDetailComponent from "@/src/features/system_admin/brands/brands_components/BrandDetail_component";

const BrandManagementPage = ({ params }: { params: Promise<{ idBrand: string }> }) => {
    const { idBrand } = use(params);

    return (
        <Div size="full" vitri="col_none">
           <BrandDetailComponent brandId={idBrand} />
        </Div>
    );
};

export default BrandManagementPage;