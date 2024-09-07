import { FC } from "react";
import Logo from "../../areas/shared/Logo";
import { Link } from "react-router-dom";
import NavbarRight from "./NavbarRight";

const Header: FC = () => { 
    return <div className={`flex items-center justify-between bg-white px-10 shadow-sm min-h-24`}>
        <Logo />
        <div className="flex gap-x-8 font-semibold text-black">
            <Link to="/" className="text-lg">Trang chủ</Link>
            <Link to="/shop" className="text-lg">Cửa hàng</Link>
            <Link to="/blog" className="text-lg">Bài viết</Link>
            <Link to='/contact' className="text-lg">Liên hệ</Link>
        </div>

        <NavbarRight />
        
    </div>
};

export default Header;
