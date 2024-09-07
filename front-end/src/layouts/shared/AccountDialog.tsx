import { Avatar, Button, Divider, Popconfirm } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAuth } from "../../feature/auth/authSlice";

type AccountDialogProps = {
    onLoginPopupOpen: () => void;
    onRegisterPopupOpen: () => void;
    onLogout: () => void;
}

const AccountDialog: FC<AccountDialogProps> = ({
    onLoginPopupOpen,
    onRegisterPopupOpen,
    onLogout
}) => {
    const { user } = useSelector(selectAuth)
    return <div className="flex flex-col w-[250px]">
        <p className="font-semibold text-[15px]">Tài khoản</p>

        {user && <div className="py-1">
            <div className="flex items-center gap-x-3">
                <Avatar className="w-16 h-16" src={user.avatar} size='large' />
                <div className="flex flex-col">
                    <span className="font-semibold text-[16px]">{user.name}</span>
                    <span className="text-[14px]">{user.roles.includes('ADMIN') ? 'Quản trị viên' : 'Khách hàng'}</span>
                </div>
            </div>

            <Divider className="mt-2 mb-2" />
            <div className="flex flex-col">
                <Link className="py-2 rounded-lg px-3 hover:text-black hover:bg-gray-100" to='/account/orders'>Đơn hàng của bạn</Link>
                <Link className="py-2 rounded-lg px-3 hover:text-black hover:bg-gray-100" to='/account/profile'>Hồ sơ</Link>
                {user?.roles?.includes('ADMIN') && <Link className="py-2 rounded-lg px-3 hover:text-black hover:bg-gray-100" to='/admin/dashboard'>Trang quản trị</Link>}
                <Popconfirm
                    className="mt-4"
                    placement="bottom"
                    title={'Đăng xuất'}
                    description={'Bạn có chắc muốn đăng xuất không!'}
                    okText="Chắc chắn"
                    cancelText="Không, hủy bỏ"
                    onConfirm={() => onLogout()}
                >
                    <Button type="default">Đăng xuất</Button>
                </Popconfirm>
            </div>

        </div>}
        {!user && <>
            <Divider className="mt-2 mb-4" />
            <div className="flex gap-x-2">
                <Button onClick={() => onLoginPopupOpen()} type="primary">Đăng nhập</Button>
                <Button onClick={() => onRegisterPopupOpen()} type="default">Đăng kí</Button>
            </div>
        </>}
    </div>
};

export default AccountDialog;
