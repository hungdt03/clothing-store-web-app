import { Avatar, Badge, Button, Divider, Popconfirm, PopconfirmProps, Popover, message } from "antd";
import { LogoutOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectAuth, signOut } from "../../feature/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import NotificationDialog from "../../areas/admin/components/NotificationDialog";
import { SmileOutlined } from '@ant-design/icons';
import { NotificationResource } from "../../resources";
import { notification as notificationAnt } from "antd";
import notificationService from "../../services/notification-service";
import { useNotification } from "../../hooks/useNotification";



const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('Click on No');
};

const AccountPopover: FC = () => {
    const navigate = useNavigate()
    const { user } = useSelector(selectAuth)
    const dispatch = useDispatch<AppDispatch>();
    const confirm: PopconfirmProps['onConfirm'] = () => {
        dispatch(signOut())
        navigate('/')
    };

    return <div className="flex flex-col p-2">
        <div className="flex gap-x-2 items-center">
            <Avatar size="large" className="cursor-pointer" src={user?.avatar} />
            <span>{user?.name}</span>
        </div>
        <Divider className="mt-2 mb-3" />
        <Popconfirm
            title="Đăng xuất"
            description="Bạn có chắc muốn đăng xuất không?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            placement="bottomRight"
        >
            <Button iconPosition="end" icon={<LogoutOutlined />}>Đăng xuất</Button>
        </Popconfirm>
    </div>
}

const Header: FC = () => {
    const { user } = useSelector(selectAuth)
    const [notifications, setNotifications] = useState<NotificationResource[]>([])

    const { notification, count } = useNotification();
    const [api, contextHolder] = notificationAnt.useNotification();

    const openNotification = (title?: string, content?: string) => {
        api.open({
            message: title,
            description: content,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            placement: "bottomLeft"
        });
    };

    useEffect(() => {
        if(notification) {
            openNotification(notification?.title, notification?.content)
            setNotifications(prev => [notification, ...prev])
        }
    }, [notification, count])

    const fetchNotifications = async () => {
        const response = await notificationService.getAllNotifications();
        setNotifications(response.data)
    }

    useEffect(() => {
        fetchNotifications();
    }, [])

    return <div className="h-[80px] flex justify-between items-center px-10">
        {contextHolder}
        <div>

        </div>
        <div className="flex items-center gap-x-6">
            <Button type="primary" shape="round">
                <Link to='/'>Trang người dùng</Link>
            </Button>
            <Popover trigger='click' placement="bottomRight" content={<NotificationDialog notifications={notifications} />}>
                <Badge size="small" count={count}>
                    <FontAwesomeIcon className="text-xl cursor-pointer" icon={faBell} />
                </Badge>
            </Popover>
            <Popover trigger='click' content={<AccountPopover />} placement="bottomRight">
                <Avatar className="cursor-pointer border-1 border-gray-100" src={user?.avatar} />
            </Popover>
        </div>
    </div>
};

export default Header;
