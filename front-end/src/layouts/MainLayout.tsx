import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setUserDetails, signOut } from "../feature/auth/authSlice";
import { NotificationResource, UserContactResource, UserResource } from "../resources";
import accountService from "../services/user-service";
import { Divider, Drawer, Empty, Flex, FloatButton, Input, Popover, Typography, notification as notificationAnt } from "antd";
const { Title } = Typography
import { CommentOutlined, SearchOutlined, BellOutlined, SmileOutlined } from '@ant-design/icons';
import ChatArea from "../areas/admin/components/ChatArea";
import ChatUserItem from "../areas/customers/components/ChatUserItem";
import notificationService from "../services/notification-service";
import NotificationDialog from "../areas/admin/components/NotificationDialog";
import { useNotification } from "../hooks/useNotification";


const MainLayout: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector(selectAuth)
    const [open, setOpen] = useState(false);
    const [adminAccounts, setAdminAccounts] = useState<UserContactResource[]>([])
    const [recipient, setRecipient] = useState<UserResource | null>(null)
    const [notifications, setNotifications] = useState<NotificationResource[]>([])
    const [api, contextHolder] = notificationAnt.useNotification();
    const { notification, count } = useNotification();

    const openNotification = (title?: string, content?: string) => {
        api.open({
            message: title,
            description: content,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            placement: "bottomLeft"
        });
    };

    const fetchUsers = async () => {
        const response = await accountService.getAllAdmins();
        setAdminAccounts(response.data);
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if(notification) {
            openNotification(notification?.title, notification?.content)
            setNotifications(prev => [notification, ...prev])
        }
    }, [notification])


    useEffect(() => {
        (async () => {
            try {
                const response = await accountService.getUserDetails();
                if (!response.success) {
                    dispatch(signOut())
                } else {
                    dispatch(setUserDetails(response.data))
                }
            } catch {
                dispatch(signOut())
            }
        })()

        const fetchNotifications = async () => {
            const response = await notificationService.getAllNotifications();
            if (response.statusCode === 401)
                dispatch(signOut())
            setNotifications(response.data)
        }

        try {
            fetchNotifications()
        } catch {
            dispatch(signOut())
        }

    }, [])

    return <>
        <Outlet />
        {contextHolder}
        {user && <div>
            <Popover trigger='click' placement="topRight" content={<NotificationDialog notifications={notifications} />}>
                <FloatButton
                    badge={{
                        count: count
                    }}
                    className="bottom-24 right-16"
                    icon={<BellOutlined />}
                />
            </Popover>
            <FloatButton onClick={showDrawer} icon={<CommentOutlined />} className="mr-10" tooltip={<div>Liên hệ</div>} />
            <Drawer width={900} size="large" title="Hỗ trợ" onClose={onClose} open={open}>
                <div className="grid grid-cols-12 gap-x-6 h-full">
                    <div className="col-span-7 bg-slate-50 h-full overflow-y-hidden">
                        {recipient && <ChatArea recipient={recipient} senderId={user?.id} />}
                        {!recipient && <div className="flex items-center justify-center h-full">
                            <Empty description="Chọn đoạn hội thoại để bắt đầu" />
                        </div>}
                    </div>
                    <div className="col-span-5 overflow-y-hidden">
                        <div className="z-10 bg-white p-4">
                            <Title level={4}>Đoạn chat</Title>
                            <Input placeholder="Nhập từ khóa tìm kiếm" prefix={<SearchOutlined />} />
                        </div>
                        <Divider className="m-0" />
                        <Flex className="bg-white h-[85%] p-2 overflow-y-auto" vertical gap={12}>
                            {adminAccounts?.length === 0 && <div className="flex items-center justify-center h-full">
                                <Empty description="Chưa có cuộc hội thoại nào" />
                            </div>}
                            {adminAccounts?.map(group => <ChatUserItem onClick={() => setRecipient(group.user)} key={group.user.id} group={group} />)}
                        </Flex>
                    </div>
                </div>
            </Drawer>
        </div>}
    </>;
};

export default MainLayout;
