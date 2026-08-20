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
const ImmersiveTemplate = dynamic<TemplateRendererProps>(() => import("./ImmersiveTemplate"));
const ZenTemplate = dynamic<TemplateRendererProps>(() => import("./ZenTemplate"));
const CafeTemplate = dynamic<TemplateRendererProps>(() => import("./CafeTemplate"));
const IceCreamTemplate = dynamic<TemplateRendererProps>(() => import("./IceCreamTemplate"));
const HotpotTemplate = dynamic<TemplateRendererProps>(() => import("./HotpotTemplate"));
const SushiTemplate = dynamic<TemplateRendererProps>(() => import("./SushiTemplate"));

export default function TemplateRenderer({ idRestaurant, coreInfo, hoursData }: TemplateRendererProps) {
    const templateCode = coreInfo?.template?.code;

    switch (templateCode) {
        case "REST_IMMERSIVE":
            return <ImmersiveTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        case "REST_LUXURY":
            return <LuxuryTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        case "REST_ZEN":
            return <ZenTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        case "REST_CAFE":
            return <CafeTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        case "REST_ICECREAM":
            return <IceCreamTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        case "REST_HOTPOT":
            return <HotpotTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        case "REST_SUSHI":
            return <SushiTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
        default:
            return <DefaultTemplate idRestaurant={idRestaurant} coreInfo={coreInfo} hoursData={hoursData} />;
    }
}
