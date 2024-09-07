import { FC } from "react";
import Services from "../components/Services";
import ProductTabs from "../components/ProductTabs";
import ClientReviews from "../components/ClientReviews";
import ShopNow from "../components/ShopNow";

const HomePage: FC = () => {
    return <div className="flex flex-col gap-y-16">
        <ProductTabs />
        <Services />
        <ShopNow />
        <ClientReviews />
    </div>
};

export default HomePage;
