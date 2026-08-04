"use client";

import MenusView from "@/src/features/brand_owner/menus/component/MenusView";
import { Div } from "@/src/core/components/ui";

export default function MenusPage() {
    return (
        <Div vitri="col_none" className="p-4 md:p-6" size="full">
            <MenusView />
        </Div>
    );
}
