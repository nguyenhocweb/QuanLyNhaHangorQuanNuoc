"use client"
import React from 'react';
import Create_Brand_form from '@/src/features/system_admin/brands/brands_components/Create_Brand_form';
import TableBrandsComponent from '@/src/features/system_admin/brands/brands_components/table-brands-component';

const BrandsPage = () => {
    return (
        <div className="w-full flex flex-col gap-8 p-4 md:p-8 min-h-screen">
            {/* Header / Create Form Banner */}
            <div className="w-full">
                <Create_Brand_form />
            </div>

            {/* Table Section */}
            <div className="w-full">
                <TableBrandsComponent />
            </div>
        </div>
    );
};

export default BrandsPage;
