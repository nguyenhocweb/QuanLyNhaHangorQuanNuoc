import React from "react";
import dynamic from "next/dynamic";
import { IPublicRestaurantCore, IPublicHoursData } from "@/src/features/public/restaurant/type/restaurant.public.type";

interface TemplateRendererProps {
    idRestaurant: string;
    coreInfo: IPublicRestaurantCore;
    hoursData?: IPublicHoursData;
}

// Lazy load các template để giảm thiểu bundle size
const DefaultTemplate = dynamic<TemplateRendererProps>(() => import("./DefaultTemplate"));
const LuxuryTemplate = dynamic<TemplateRendererProps>(() => import("./LuxuryTemplate"));

export default function TemplateRenderer({ idRestaurant, coreInfo, hoursData }: TemplateRendererProps) {
    const templateCode = coreInfo?.template?.code;

    if (templateCode === "REST_LUXURY") {
        return <LuxuryTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
    }

    return <DefaultTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
}
