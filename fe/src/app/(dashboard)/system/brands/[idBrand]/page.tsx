import React from 'react';
import BrandDetailComponent from "@/src/features/system_admin/brands/brands_components/BrandDetail_component";

export default async function BrandDetailPage({ params }: { params: Promise<{ idBrand: string }> }) {
    const { idBrand } = await params;
    return (
        <div className="w-full h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <BrandDetailComponent brandId={idBrand} />
        </div>
    );
}
