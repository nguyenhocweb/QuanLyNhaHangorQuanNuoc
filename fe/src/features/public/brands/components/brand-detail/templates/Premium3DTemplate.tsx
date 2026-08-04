import React from "react";
import BrandDetail3DBackground from "../BrandDetail3DBackground";
import BrandDetailHero from "../BrandDetailHero";
import BrandDetailContactCard from "../BrandDetailContactCard";
import BrandDetailEcosystem from "../BrandDetailEcosystem";

interface Premium3DTemplateProps {
    data: any;
    idBrand: string;
}

const Premium3DTemplate = ({ data, idBrand }: Premium3DTemplateProps) => {
    return (
        <BrandDetail3DBackground>
            <div className="flex flex-col gap-8 sm:gap-12 w-full animate-fade-in">
                {/* 1. Hero Section & Bộ 4 Thẻ Thống kê VIP */}
                <BrandDetailHero data={data} />

                {/* 2. Thẻ Kính mờ Liên hệ & Đội ngũ Lãnh đạo */}
                <BrandDetailContactCard data={data} />

                {/* 3. Phân khu Trải nghiệm: Thực đơn Tinh hoa & Chi nhánh */}
                <BrandDetailEcosystem idBrand={idBrand} brandName={data?.name} />
            </div>
        </BrandDetail3DBackground>
    );
};

export default Premium3DTemplate;
