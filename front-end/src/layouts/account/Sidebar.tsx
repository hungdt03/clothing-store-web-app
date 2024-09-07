import { FC } from "react";
import { UserOutlined, OrderedListOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const Sidebar: FC = () => {
    return <div className="p-4 w-[300px] flex flex-col gap-y-3">
        <Link to='/account/profile' className="flex items-center gap-x-3 px-4 text-[16px] cursor-pointer p-2 rounded-xl hover:bg-gray-100">
            <UserOutlined />
            <span >Hồ sơ</span>
        </Link>
        <Link to='/account/wishlist' className="flex items-center gap-x-3 px-4 text-[16px] cursor-pointer p-2 rounded-xl hover:bg-gray-100">
            <FontAwesomeIcon icon={faHeart} />
            <span >Wishlist</span>
        </Link>
        <Link to='/account/orders' className="flex items-center gap-x-3 px-4 text-[16px] cursor-pointer p-2 rounded-xl hover:bg-gray-100">
            <OrderedListOutlined />
            <span >Đơn hàng của tôi</span>
        </Link>
        <Link to='/account/address-order' className="flex items-center gap-x-3 px-4 text-[16px] cursor-pointer p-2 rounded-xl hover:bg-gray-100">
            <FontAwesomeIcon icon={faLocationDot} />
            <span >Địa chỉ đã lưu</span>
        </Link>
    </div>;
};

export default Sidebar;
