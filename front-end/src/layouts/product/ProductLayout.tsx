import { FC, useState } from "react";
import HeaderFadeIn from "../shared/HeaderFadeIn";
import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import Footer from "../shared/Footer";

const ProductLayout: FC = () => {
    const [fixed, setFixed] = useState(false)

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = event.currentTarget.scrollTop;
        if (scrollTop >= 96) {
            setFixed(true)
        } else if (scrollTop === 0) {
            setFixed(false)
        }

    }

    return <div onScroll={handleScroll} className="flex flex-col h-screen overflow-y-auto">
        <HeaderFadeIn fixed={fixed} />
        <Header />
        <Outlet />
        <Footer />
    </div>;
};

export default ProductLayout;
