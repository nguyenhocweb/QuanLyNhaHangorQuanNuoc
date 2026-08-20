import React from "react";
import Premium3DTemplate from "./templates/Premium3DTemplate";
import StandardTemplate from "./templates/StandardTemplate";
import LuxuryTemplate from "./templates/LuxuryTemplate";
import VibrantTemplate from "./templates/VibrantTemplate";
import ZenBrandTemplate from "./templates/ZenBrandTemplate";

import { BrandTemplateTheme } from "@/src/core/lib/configTemplates";

interface TemplateRendererProps {
    theme: BrandTemplateTheme;
    data: any;
    idBrand: string;
}

const TemplateRenderer = ({ theme, data, idBrand }: TemplateRendererProps) => {
    switch (theme) {
        case "standard":
            return <StandardTemplate data={data} idBrand={idBrand} />;
        case "premium3d":
            return <Premium3DTemplate data={data} idBrand={idBrand} />;
        case "luxury":
            return <LuxuryTemplate data={data} idBrand={idBrand} />;
        case "vibrant":
            return <VibrantTemplate data={data} idBrand={idBrand} />;
        case "zen":
            return <ZenBrandTemplate data={data} idBrand={idBrand} />;
        default:
            return <StandardTemplate data={data} idBrand={idBrand} />; // Fallback to current standard
    }
};

export default TemplateRenderer;
