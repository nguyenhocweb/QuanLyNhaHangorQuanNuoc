"use client";

import MyBrandView from "@/src/features/brand_owner/my_brand/component/MyBrandView";
import { Div } from "@/src/core/components/ui";

export default function MyBrandPage() {
    return (
        <Div vitri="col_none" className="p-4 md:p-6" size="full">
            <MyBrandView />
        </Div>
    );
}
