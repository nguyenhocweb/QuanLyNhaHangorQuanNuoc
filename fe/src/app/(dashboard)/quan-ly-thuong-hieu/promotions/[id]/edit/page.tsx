import EditPromotionPage from "@/src/features/brand_owner/promotions/component/EditPromotionPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditPromotionPage promotionId={id} />;
}
