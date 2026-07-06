
import { Div, P, A } from "@/src/core/components/ui";
import FeaturedBrandComponent from "@/src/features/public/brands/components/featured-brands-components";
import PublicHome from "@/src/core/components/layout/public-home";
import Featured_Restaurant_Component from "@/src/features/public/restaurant/restaurant_components/demo-card-restaurant/featured-restaurant-component";
import ChatBoxAi from "@/src/features/public/chatbox_ai/chatBoxAi_component/public-chatbox";
import FeaturedDishComponent from "@/src/features/public/dish/dish_component/featured-dish-component";
import { Suspense } from "react";

const PageHome = () => {
    return (
        <Suspense fallback={<Div>Loading...</Div>}>
            <PublicHome />
            <Div vitri="col_none" className="px-10 py-20 gap-y-40 " >
                <FeaturedBrandComponent type="home"/>
                <Featured_Restaurant_Component type="home"/>
                <FeaturedDishComponent type="home"/>
            </Div>
             <ChatBoxAi/>
        </Suspense>
    )
}
export default PageHome