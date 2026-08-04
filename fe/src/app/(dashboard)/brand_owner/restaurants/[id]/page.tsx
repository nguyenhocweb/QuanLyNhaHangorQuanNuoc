import { Div } from "@/src/core/components/ui";
import BranchDetail from "@/src/features/brand_owner/restaurants/component/BranchDetail";

const BranchDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return (
        <Div vitri="col_none" className="p-4 md:p-10" size="full">
            <BranchDetail id={id} />
        </Div>
    );
};

export default BranchDetailPage;
