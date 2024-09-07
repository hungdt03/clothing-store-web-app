import { FC } from "react";

import NavbarRight from "./NavbarRight";
import { Link } from "react-router-dom";


type HeaderFadeInProps = {
    fixed: boolean;
}

const HeaderFadeIn: FC<HeaderFadeInProps> = ({
    fixed
}) => {



    return <div className={`${fixed && 'translate-y-24'} shadow-sm bg-white fixed -top-24 left-0 right-0 z-20 transition-all ease-linear flex items-center justify-between px-10 h-24`}>
        <div className="p-3 font-bold flex justify-center items-center rounded-full text-black bg-transparent text-3xl">
            <span className="text-black">&lt;Hung</span><span className="text-primary">Shop /&gt;</span>
        </div>

        <div className="flex gap-x-8 font-semibold">
            <Link to="/" className="text-lg">Trang chủ</Link>
            <Link to="/shop" className="text-lg">Cửa hàng</Link>
            <Link to="/blog" className="text-lg">Bài viết</Link>
            <Link to='/contact' className="text-lg">Liên hệ</Link>
        </div>

        <NavbarRight />
    </div>;
};

export default HeaderFadeIn;

