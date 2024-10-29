import { FC, useState } from "react";
import { AppstoreOutlined, SettingOutlined, MessageOutlined, DashboardOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Menu, MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'sub1',
        label: <Link to='/admin/dashboard'>Dashboard</Link>,
        icon: <DashboardOutlined />,
    },
    {
        key: 'sub2',
        label: 'Quản lí',
        icon: <AppstoreOutlined />,
        children: [
            { key: '4', label: <Link to='/admin/category'>Danh mục</Link> },
            { key: '5', label: <Link to='/admin/brand'>Nhãn hiệu</Link> },
            { key: '6', label: <Link to='/admin/product'>Sản phẩm</Link> },
            { key: '8', label: <Link to='/admin/order'>Đơn hàng</Link> },
            { key: '9', label: <Link to='/admin/account'>Tài khoản</Link> },
        ],
    },
    {
        key: 'sub4',
        label: 'Cài đặt',
        icon: <SettingOutlined />,
        children: [
            { key: '10', label: <Link to='/admin/color'>Màu sắc</Link> },
            { key: '11', label: <Link to='/admin/size'>Kích cỡ</Link> },
            { key: '12', label: <Link to='/admin/setting/slide'>Slide</Link> },
            { key: '13', label: <Link to='/admin/setting/top-review'>Top Review</Link> },
        ],
    },
    {
        key: 'sub5',
        label: <Link to='/admin/blog'>Bài viết</Link>,
        icon: <BookOutlined />,
    },
    {
        key: 'sub6',
        label: <Link to='/admin/conservation'>Liên hệ</Link>,
        icon: <MessageOutlined />,
    },
];

const Sidebar: FC = () => {
    const [current, setCurrent] = useState('1');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };


    return <div className="min-w-[270px] flex flex-col justify-between h-screen overflow-y-auto custom-scrollbar scrollbar-h-4">
        <div className="flex flex-col p-4 gap-y-8">
            <div className="text-2xl font-bold text-center p-2">
                <span className="text-black">&lt;Hung</span><span className="text-primary">Shop /&gt;</span>
            </div>
            <Menu
                onClick={onClick}
                style={{ width: 230, border: 0 }}
                defaultOpenKeys={['sub1']}
                selectedKeys={[current]}
                mode="inline"
                items={items}
                className="text-[17px]"
            />
        </div>
        <div className="p-4">
            <Button className="w-full">Đăng xuất</Button>
        </div>
    </div>;
};

export default Sidebar;
