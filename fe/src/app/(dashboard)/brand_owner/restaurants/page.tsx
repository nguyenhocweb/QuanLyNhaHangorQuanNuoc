import { Div } from "@/src/core/components/ui";
import BranchesList from "@/src/features/brand_owner/restaurants/component/BranchesList";

const BrandOwnerRestaurantsPage = () => {
    return (
        <Div vitri="col_none" className="p-4 md:p-10" size="full">
            <BranchesList />
        </Div>
    );
};

export default BrandOwnerRestaurantsPage;
