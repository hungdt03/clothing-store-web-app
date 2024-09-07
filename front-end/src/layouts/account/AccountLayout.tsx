import { FC, useEffect, useState } from "react";
import Header from "../shared/Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import Footer from "../shared/Footer";
import HeaderFadeIn from "../shared/HeaderFadeIn";

type pathRoute = "orders" | "address-order" | "wishlist" | "profile"

const breadcrumbs = {
    "orders": "Đơn hàng của tôi",
    "address-order": "Địa chỉ đã lưu",
    "wishlist": "Danh sách yêu thích",
    "profile": "Hồ sơ",
} as Record<pathRoute, string>

const AccountLayout: FC = () => {
    const [fixed, setFixed] = useState(false)
    const location = useLocation();
    const pathAfterAccount = location.pathname.split('/account/')[1] as pathRoute;
   

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
        <div className="flex px-10 pt-10 gap-x-6">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Breadcrumb
                    separator=">"
                    className="pt-6 text-[16px]"
                    items={[
                        {
                            title: 'Trang chủ',
                        },
                        {
                            title: 'Tài khoản',
                            href: '',
                        },
                        {
                            title: breadcrumbs[pathAfterAccount],
                            href: '',
                        },
                    ]}
                />
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
};

export default AccountLayout;
