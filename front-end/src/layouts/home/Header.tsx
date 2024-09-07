import { FC } from "react";
import Logo from "../../areas/shared/Logo";
import { Link } from "react-router-dom";
import NavbarRight from "../shared/NavbarRight";

export type ModalAuthType = 'login' | 'register' | 'forgot';

const Header: FC = () => {
    return <div className={`z-10 flex items-center justify-between min-h-24`}>
        <Logo />
        <div className="flex gap-x-8 text-black font-semibold">
            <Link to="/" className="text-lg">Trang chủ</Link>
            <Link to="/shop" className="text-lg">Cửa hàng</Link>
            <Link to="/blog" className="text-lg">Bài viết</Link>
            <Link to='/contact' className="text-lg">Liên hệ</Link>
        </div>
        <NavbarRight />
    </div>
};


export default Header;
