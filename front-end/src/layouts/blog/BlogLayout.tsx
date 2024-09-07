import { FC, useState } from "react";
import HeaderFadeIn from "../shared/HeaderFadeIn";
import Header from "../shared/Header";
import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer";

const BlogLayout: FC = () => {
    const [fixed, setFixed] = useState(false)


    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = event.currentTarget.scrollTop;
        if (scrollTop >= 96) {
            setFixed(true)
        } else if (scrollTop === 0) {
            setFixed(false)
        }
    }

    return <div onScroll={handleScroll} className="h-screen overflow-y-auto bg-slate-50">
        <HeaderFadeIn fixed={fixed} />
        <Header />

        <div className="w-[1000px] mx-auto">
            <Outlet />
        </div>
        <Footer />
    </div>
};

export default BlogLayout;
