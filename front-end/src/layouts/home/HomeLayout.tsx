import { FC, useState } from "react";
import Header from "./Header";
import Slider from "./Slider";
import HeaderFadeIn from "../shared/HeaderFadeIn";
import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer";

const HomeLayout: FC = () => {
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
        <div style={{
            minHeight: '90vh'
        }} className="flex flex-col relative mb-10 px-10">
            <Header />
            <Slider />
        </div>
        <div>
            <Outlet />
        </div>
        <Footer />
    </div>;
};

export default HomeLayout;
